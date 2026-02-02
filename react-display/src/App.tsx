// react-display/src/App.tsx

import { TimeProvider } from './contexts/TimeContext';
import { Header } from './components/Header';
import { ViewRouter } from './components/ViewRouter';

function App() {
	return (
		<div className='flex flex-col h-screen w-full overflow-hidden'>
			<TimeProvider>
				<Header />
				<ViewRouter />
			</TimeProvider>
		</div>
	);
}

export default App;
