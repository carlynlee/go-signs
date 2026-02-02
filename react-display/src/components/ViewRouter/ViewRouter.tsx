// react-display/src/components/ViewRouter/ViewRouter.tsx

import { useState, useEffect } from 'react';
import { SponsorBanner } from '../SponsorBanner';
import { ScheduleCarousel } from '../ScheduleCarousel';
import { SponsorThankYou } from '../SponsorThankYou';

type ViewMode = 'schedule' | 'sponsors';

export function ViewRouter() {
	const [viewMode, setViewMode] = useState<ViewMode>('schedule');

	// Check URL hash for view mode on mount and hash changes
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.slice(1);
			if (hash === 'sponsors') {
				setViewMode('sponsors');
			} else {
				setViewMode('schedule');
			}
		};

		handleHashChange();
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	if (viewMode === 'sponsors') {
		return (
			<div className='flex-1 overflow-hidden'>
				<SponsorThankYou
					otherSponsorsPerPage={12}
					rotationInterval={8000}
				/>
			</div>
		);
	}

	return (
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
	);
}
