import { StartupTypeCard } from "@/components/StartupCard";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
	return new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function parseServerActionResponse<T>(response: T) {
	return JSON.parse(JSON.stringify(response));
}

export const topFour = (data: StartupTypeCard[]) => {
	return data
		.sort((a, b) => b.views! - a.views!) // ترتيب تنازلي
		.slice(0, 4); // استخراج أعلى 4
};
