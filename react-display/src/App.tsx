// react-display/src/App.tsx

import { TimeProvider } from './contexts/TimeContext';
import { SponsorProvider } from './contexts/SponsorContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { Header } from './components/Header';
import { ViewRouter } from './components/ViewRouter';

function App() {
	return (
		<div className='flex flex-col h-screen w-full overflow-hidden'>
			<TimeProvider>
				<SponsorProvider>
					<ScheduleProvider refreshInterval={60000}>
						<Header />
						<ViewRouter />
					</ScheduleProvider>
				</SponsorProvider>
			</TimeProvider>
		</div>
	);
}

export default App;
