package signs

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	cron "gopkg.in/robfig/cron.v2"
)

// Server is the main web server process
type Server struct {
	cron  *cron.Cron
	httpd *http.Server
}

// NewServer sets up the cron jobs for schedule updates and returns the *Server
func NewServer(c Config) *Server {
	// Initialize a new cron scheduler
	cron := cron.New()

	// Create a new Schedule instance
	sch := newSchedule()

	// Set up XML schedule updates if configured
	if c.ScheduleXMLurl != "" && c.ScheduleXMLupdate != "" {
		sch.xmlURL = c.ScheduleXMLurl
		cron.AddFunc(c.ScheduleXMLupdate, sch.updateFromXML)
		sch.updateFromXML() // Initial fetch
	}

	// Set up JSON schedule updates if configured
	if c.ScheduleJSONurl != "" && c.ScheduleJSONupdate != "" {
		sch.jsonURL = c.ScheduleJSONurl
		cron.AddFunc(c.ScheduleJSONupdate, sch.updateFromJSON)
		sch.updateFromJSON() // Initial fetch
	}

	// Create a new router
	r := mux.NewRouter()
	r.Use(middlewareLogging) // Add logging middleware

	// Serve static files
	staticDir := "./static"
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir))))

	// Default route to serve index.html
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, staticDir+"/index.html")
	})

	// Dynamic routes for the application
	createRoutes(r, sch)

	// Set up the HTTP server
	srv := &http.Server{
		Handler:      r,
		Addr:         c.Address, // Address from configuration
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	return &Server{
		cron:  cron,
		httpd: srv,
	}
}

// ListenAndServe starts the server and cron jobs
func (s *Server) ListenAndServe() error {
	s.cron.Start() // Start the cron scheduler
	log.Printf("Listening on %s", s.httpd.Addr)
	return s.httpd.ListenAndServe()
}

// Middleware to log HTTP requests
func middlewareLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s %s %s", r.RemoteAddr, r.Header["User-Agent"], r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}

