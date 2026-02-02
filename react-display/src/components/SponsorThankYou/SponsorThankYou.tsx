// react-display/src/components/SponsorThankYou/SponsorThankYou.tsx

import { useState, useEffect, useRef } from 'react';
import { useSponsor } from '../../contexts/SponsorContext';
import { useTime } from '../../contexts/TimeContext';

interface SponsorTierProps {
	title: string;
	sponsors: string[];
	imageSize: string;
	gridCols: string;
}

function SponsorTier({ title, sponsors, imageSize, gridCols }: SponsorTierProps) {
	if (sponsors.length === 0) return null;

	return (
		<div className="mb-6">
			<h2 className="text-center text-2xl font-semibold text-slate-700 mb-4 tracking-wide uppercase">
				{title}
			</h2>
			<div className={`grid ${gridCols} gap-6 justify-items-center`}>
				{sponsors.map((url) => (
					<div
						key={url}
						className={`${imageSize} bg-white rounded-xl shadow-lg p-4 flex items-center justify-center transition-transform hover:scale-105`}
					>
						<img
							src={url}
							alt="Sponsor logo"
							className="max-w-full max-h-full object-contain"
							loading="lazy"
						/>
					</div>
				))}
			</div>
		</div>
	);
}

interface SponsorThankYouProps {
	otherSponsorsPerPage?: number;
	rotationInterval?: number;
}

export function SponsorThankYou({
	otherSponsorsPerPage = 12,
	rotationInterval = 8000,
}: SponsorThankYouProps) {
	const {
		getPlatinumSponsorUrls,
		getGoldSponsorUrls,
		getOtherSponsorUrls,
		isLoading,
		error,
	} = useSponsor();
	const { currentTime } = useTime();

	const [currentPage, setCurrentPage] = useState(0);
	const lastRotationTime = useRef<number>(currentTime.getTime());

	const platinumSponsors = getPlatinumSponsorUrls();
	const goldSponsors = getGoldSponsorUrls();
	const otherSponsors = getOtherSponsorUrls();

	const totalPages = Math.ceil(otherSponsors.length / otherSponsorsPerPage);
	const currentOtherSponsors = otherSponsors.slice(
		currentPage * otherSponsorsPerPage,
		(currentPage + 1) * otherSponsorsPerPage
	);

	// Rotate through other sponsors pages based on TimeContext
	useEffect(() => {
		if (totalPages <= 1) return;

		const elapsed = currentTime.getTime() - lastRotationTime.current;
		if (elapsed >= rotationInterval) {
			setCurrentPage((prev) => (prev + 1) % totalPages);
			lastRotationTime.current = currentTime.getTime();
		}
	}, [currentTime, totalPages, rotationInterval]);

	if (isLoading) {
		return (
			<div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100">
				<div className="text-2xl text-slate-600 animate-pulse">
					Loading sponsors...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="h-full w-full flex items-center justify-center bg-red-50">
				<div className="text-xl text-red-700">
					Failed to load sponsors: {error.message}
				</div>
			</div>
		);
	}

	return (
		<div className="h-full w-full bg-gradient-to-br from-sky-50 via-white to-indigo-50 overflow-auto p-8">
			{/* Header */}
			<div className="text-center mb-8">
				<h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent mb-2">
					Thank You to Our Sponsors
				</h1>
				<p className="text-xl text-slate-500">
					We couldn't do this without your support
				</p>
			</div>

			{/* Platinum Sponsors */}
			<SponsorTier
				title="Platinum Sponsors"
				sponsors={platinumSponsors}
				imageSize="w-48 h-32"
				gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
			/>

			{/* Gold Sponsors */}
			<SponsorTier
				title="Gold Sponsors"
				sponsors={goldSponsors}
				imageSize="w-40 h-28"
				gridCols="grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
			/>

			{/* Other Sponsors */}
			<div className="mb-6">
				<h2 className="text-center text-2xl font-semibold text-slate-700 mb-4 tracking-wide uppercase">
					Community Sponsors
				</h2>
				<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
					{currentOtherSponsors.map((url) => (
						<div
							key={url}
							className="w-28 h-20 bg-white rounded-lg shadow-md p-3 flex items-center justify-center transition-all duration-500"
						>
							<img
								src={url}
								alt="Sponsor logo"
								className="max-w-full max-h-full object-contain"
								loading="lazy"
							/>
						</div>
					))}
				</div>
				{totalPages > 1 && (
					<div className="flex justify-center gap-2 mt-4">
						{Array.from({ length: totalPages }).map((_, idx) => (
							<div
								key={idx}
								className={`w-2 h-2 rounded-full transition-colors ${
									idx === currentPage ? 'bg-indigo-500' : 'bg-slate-300'
								}`}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
