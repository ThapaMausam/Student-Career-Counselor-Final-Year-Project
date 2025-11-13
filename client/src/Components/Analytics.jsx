import { useState, useEffect } from 'react';
import { useLanguage, toNepaliNumber } from '../hooks/useLanguage';

const Analytics = ({ language, setLanguage }) => {
	const { t } = useLanguage(language, setLanguage);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [evaluation, setEvaluation] = useState(null);
	const [stats, setStats] = useState(null);

	useEffect(() => {
		setLoading(true);
		setError('');
		Promise.all([
			fetch('http://localhost:3001/api/evaluate/see').then(r => r.json()),
			fetch('http://localhost:3001/api/model-stats/see').then(r => r.json())
		])
			.then(([evalRes, statsRes]) => {
				if (!evalRes.success) throw new Error(evalRes.error || 'Evaluation failed');
				if (!statsRes.success) throw new Error(statsRes.error || 'Stats failed');
				setEvaluation(evalRes.evaluation || {});
				setStats(statsRes.stats || {});
			})
			.catch((e) => {
				console.error('Analytics fetch error:', e);
				setError('Unable to fetch analytics. Ensure backend is running.');
			})
			.finally(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
					<p className="text-gray-600">{t('analytics.analyzing')}</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
				<div className="bg-white shadow-lg rounded-lg p-8 text-center">
					<h2 className="text-2xl font-bold text-red-600 mb-2">{t('analytics.backendOffline')}</h2>
					<p className="text-gray-700">{error}</p>
				</div>
			</div>
		);
	}

	if (!evaluation || !stats) return null;

	const collegeAccuracy = typeof evaluation.collegeAccuracy === 'number' ? evaluation.collegeAccuracy : null;
	const totalPredictions = typeof stats.totalPredictions === 'number' ? stats.totalPredictions : 0;
	const collegeDistribution = stats.collegeDistribution || {};
	const monthlyTrends = Array.isArray(stats.monthlyTrends) ? stats.monthlyTrends : [];
	const attributeImportance = Array.isArray(stats.attributeImportance) ? stats.attributeImportance : [];

	const number = (n) => (language === 'ne' ? toNepaliNumber(n) : n);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">{t('analytics.title')}</h1>
					<p className="text-gray-600">{t('analytics.subtitle')}</p>
				</div>

				{/* Key Metrics */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-md p-6">
						<p className="text-sm font-medium text-gray-600">{t('analytics.totalPredictions')}</p>
						<p className="text-2xl font-bold text-gray-900">{number(totalPredictions)}</p>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6">
						<p className="text-sm font-medium text-gray-600">{t('analytics.collegeAccuracy')}</p>
						<p className="text-2xl font-bold text-gray-900">{collegeAccuracy != null ? number(collegeAccuracy) : 'N/A'}%</p>
					</div>
					<div className="bg-white rounded-lg shadow-md p-6">
						<p className="text-sm font-medium text-gray-600">{t('analytics.topCollege')}</p>
						<p className="text-2xl font-bold text-gray-900">{stats.topCollege || '—'}</p>
					</div>
				</div>

				{/* College Distribution */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.collegeDistribution')}</h3>
					<div className="space-y-3">
						{Object.entries(collegeDistribution).map(([college, count]) => {
							const pct = totalPredictions ? ((count / totalPredictions) * 100).toFixed(1) : 0;
							return (
								<div key={college} className="flex items-center">
									<div className="w-28 text-sm font-medium text-gray-700">{college}</div>
									<div className="flex-1 mx-4">
										<div className="bg-gray-200 rounded-full h-3">
											<div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${pct}%` }}></div>
										</div>
									</div>
									<div className="w-24 text-right text-sm text-gray-600">{number(count)} ({number(pct)}%)</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Monthly Trends */}
				<div className="bg-white rounded-lg shadow-md p-6 mb-8">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.monthlyTrends')}</h3>
					<div className="overflow-x-auto">
						<table className="min-w-full">
							<thead>
								<tr className="border-b border-gray-200">
									<th className="text-left py-3 px-4 font-medium text-gray-700">{t('analytics.month')}</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">{t('analytics.predictions')}</th>
									<th className="text-left py-3 px-4 font-medium text-gray-700">{t('analytics.accuracy')}</th>
								</tr>
							</thead>
							<tbody>
								{monthlyTrends.map((m) => (
									<tr key={m.month} className="border-b border-gray-100">
										<td className="py-3 px-4">{m.month}</td>
										<td className="py-3 px-4">{number(m.predictions)}</td>
										<td className="py-3 px-4">{number(m.accuracy)}%</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Attribute Importance */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">{t('analytics.attributeImportance')}</h3>
					<div className="space-y-3">
						{attributeImportance.map((attr) => (
							<div key={attr.attribute} className="flex items-center">
								<div className="w-40 text-sm font-medium text-gray-700">{attr.attribute.replace('_', ' ')}</div>
								<div className="flex-1 mx-4">
									<div className="bg-gray-200 rounded-full h-3">
										<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: `${attr.importance * 100}%` }}></div>
									</div>
								</div>
								<div className="w-16 text-right text-sm text-gray-600">{number((attr.importance * 100).toFixed(1))}%</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Analytics;
