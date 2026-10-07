<!-- the scrolling page area shared by the one-way and round-trip layouts -->
<main
	class="min-w-0 w-full flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f5] pb-[max(2.5rem,env(safe-area-inset-bottom))]"
>
	<div class="w-full min-w-0 space-y-3 px-4 pt-4 sm:px-6 md:space-y-4 md:pt-6 lg:px-10 xl:px-16">
		<slot />
	</div>
</main>
