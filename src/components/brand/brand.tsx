import { Waves } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface BrandProps {
	showWordmark?: boolean;
	showTagline?: boolean;
	className?: string;
	iconContainerClassName?: string;
	iconClassName?: string;
	nameClassName?: string;
	taglineClassName?: string;
}

export const Brand = ({
	showWordmark = true,
	showTagline = false,
	className,
	iconContainerClassName,
	iconClassName,
	nameClassName,
	taglineClassName,
}: BrandProps) => {
	const { t } = useTranslation("app");

	return (
		<div
			className={cn(
				"flex items-center overflow-visible",
				showWordmark ? "gap-3" : "justify-center gap-0",
				className,
			)}
		>
			<div
				className={cn(
					"flex size-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-primary-foreground shadow-sm ring-1 ring-primary/10",
					iconContainerClassName,
				)}
			>
				<Waves className={cn("size-5", iconClassName)} strokeWidth={2.2} />
			</div>

			{showWordmark ? (
				<div className="min-w-0">
					<p
						className={cn(
							"truncate font-manrope text-lg font-black tracking-tight text-foreground",
							nameClassName,
						)}
					>
						{t("name")}
					</p>
					{showTagline ? (
						<p
							className={cn(
								"text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground",
								taglineClassName,
							)}
						>
							{t("tagline")}
						</p>
					) : null}
				</div>
			) : null}
		</div>
	);
};
