import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
	const { t } = useTranslation("pagination");

	return (
		<nav
			role="navigation"
			aria-label={t("navigation")}
			data-slot="pagination"
			className={cn("mx-auto flex w-full justify-center", className)}
			{...props}
		/>
	);
}

function PaginationContent({
	className,
	...props
}: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="pagination-content"
			className={cn("flex items-center gap-1", className)}
			{...props}
		/>
	);
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
	return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
	isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
	React.ComponentProps<"a">;

function PaginationLink({
	className,
	isActive,
	size = "icon",
	...props
}: PaginationLinkProps) {
	return (
		<Button
			asChild
			variant={isActive ? "outline" : "ghost"}
			size={size}
			className={cn(className)}
		>
			<a
				aria-current={isActive ? "page" : undefined}
				data-slot="pagination-link"
				data-active={isActive}
				{...props}
			/>
		</Button>
	);
}

function PaginationPrevious({
	className,
	text,
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	const { t } = useTranslation("pagination");

	return (
		<PaginationLink
			aria-label={t("previousAriaLabel")}
			size="default"
			className={cn("pl-2!", className)}
			{...props}
		>
			<ChevronLeftIcon data-icon="inline-start" />
			<span className="hidden sm:block">{text ?? t("previous")}</span>
		</PaginationLink>
	);
}

function PaginationNext({
	className,
	text,
	...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
	const { t } = useTranslation("pagination");

	return (
		<PaginationLink
			aria-label={t("nextAriaLabel")}
			size="default"
			className={cn("pr-2!", className)}
			{...props}
		>
			<span className="hidden sm:block">{text ?? t("next")}</span>
			<ChevronRightIcon data-icon="inline-end" />
		</PaginationLink>
	);
}

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	const { t } = useTranslation("pagination");

	return (
		<span
			aria-hidden
			data-slot="pagination-ellipsis"
			className={cn(
				"flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<MoreHorizontalIcon />
			<span className="sr-only">{t("morePages")}</span>
		</span>
	);
}

export {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
