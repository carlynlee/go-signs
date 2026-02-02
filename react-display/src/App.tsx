// react-display/src/App.tsx

import { HashRouter, Routes, Route } from 'react-router-dom';
import { TimeProvider } from './contexts/TimeContext';
import { SponsorProvider } from './contexts/SponsorContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { Header } from './components/Header';
import { SponsorBanner } from './components/SponsorBanner';
import { ScheduleCarousel } from './components/ScheduleCarousel';
import { SponsorThankYou } from './components/SponsorThankYou';

function App() {
	return (
		<HashRouter>
			<div className='flex flex-col h-screen w-full overflow-hidden'>
				<TimeProvider>
					<SponsorProvider>
						<ScheduleProvider refreshInterval={60000}>
							<Header />
							<Routes>
								<Route path='/' element={
									<div className='flex flex-1 bg-white overflow-hidden'>
										<div className='w-4/5 p-2 overflow-y-auto'>
											<ScheduleCarousel
												maxDisplay={6}
												rotationInterval={15000}
											/>
										</div>
										<div className='w-1/5 p-2'>
											<SponsorBanner
												displayCount={3}
												rotationInterval={10000}
											/>
										</div>
									</div>
								} />
								<Route path='/sponsors' element={
									<div className='flex-1 overflow-hidden'>
										<SponsorThankYou
											otherSponsorsPerPage={12}
											rotationInterval={8000}
										/>
									</div>
								} />
							</Routes>
						</ScheduleProvider>
					</SponsorProvider>
				</TimeProvider>
			</div>
		</HashRouter>
	);
}

export default App;
