export function priorityToImportance(priority: 1 | 2 | 3) {
	return priority === 1 ? "LOW" : priority === 2 ? "MEDIUM" : "HIGH";
}
