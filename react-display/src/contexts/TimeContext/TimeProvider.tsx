// react-display/src/contexts/TimeContext/TimeProvider.tsx

import { useState, useEffect, useMemo, useRef } from 'react';
import { TimeContext } from './timeContext';

interface TimeProviderProps {
	children: React.ReactNode;
}

export function TimeProvider({ children }: TimeProviderProps) {
	const [currentTime, setCurrentTime] = useState<Date>(new Date());
	const timeOffsetRef = useRef<number>(0);

	useEffect(() => {
		// Get initial time based on URL parameters or current time
		const getInitialTime = (): Date => {
			const params = new URLSearchParams(window.location.search);
			const now = new Date();

			// Helper to parse param or use fallback (handles null and empty string)
			const parseParam = (param: string | null, fallback: number): number =>
				param !== null && param !== '' ? parseInt(param, 10) : fallback;

			const year = parseParam(params.get('year'), now.getFullYear());
			const monthParam = params.get('month');
			const month = monthParam !== null && monthParam !== '' ? parseInt(monthParam, 10) - 1 : now.getMonth(); // URL is 1-indexed, JS is 0-indexed
			const day = parseParam(params.get('day'), now.getDate());
			const hour = parseParam(params.get('hour'), now.getHours());
			const minute = parseParam(params.get('minute'), now.getMinutes());

			return new Date(year, month, day, hour, minute, 0);
		};

		// Calculate the offset between initial time and actual time
		const initialTime = getInitialTime();
		const initialRealTime = new Date();
		timeOffsetRef.current = initialTime.getTime() - initialRealTime.getTime();

		// Set initial time
		setCurrentTime(initialTime);

		// Function to update the time
		const updateTime = () => {
			const now = new Date();
			const adjustedTime = new Date(now.getTime() + timeOffsetRef.current);
			setCurrentTime(adjustedTime);
		};

		// Set up interval for updates
		const intervalId = window.setInterval(updateTime, 60000); // 60000 ms = 1 minute

		// Also update every second for testing purposes
		// In production, you might want to remove this and only keep the minute interval
		const secondIntervalId = window.setInterval(updateTime, 1000);

		// Clean up intervals on component unmount
		return () => {
			window.clearInterval(intervalId);
			window.clearInterval(secondIntervalId);
		};
	}, []); // Empty dependency array means this effect runs once on mount

	// Memoize the context value to prevent unnecessary renders
	const contextValue = useMemo(() => ({ currentTime }), [currentTime]);

	return <TimeContext value={contextValue}>{children}</TimeContext>;
}
