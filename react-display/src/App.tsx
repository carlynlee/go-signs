// react-display/src/App.tsx

import { TimeProvider } from './contexts/TimeContext';
import { SponsorProvider } from './contexts/SponsorContext';
import { ViewRouter } from './components/ViewRouter';

function App() {
	return (
		<div className='flex flex-col h-screen w-full overflow-hidden'>
			<TimeProvider>
				<SponsorProvider>
					<ViewRouter />
				</SponsorProvider>
			</TimeProvider>
		</div>
	);
}

export default App;
