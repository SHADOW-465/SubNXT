<script lang="ts">
  import { type Subtitle, type SubtitleStyle } from "$lib/stores/projectStore.svelte";
  import { cn } from "$lib/utils";

  let { subtitles, style, currentTime } = $props<{
      subtitles: Subtitle[],
      style: SubtitleStyle,
      currentTime: number
  }>();

  let activeSubtitle = $derived(
      subtitles.find(s => currentTime >= s.startTime && currentTime <= s.endTime)
  );

  // Helper to generate style string
  function getStyleString(s: SubtitleStyle) {
      return `
        font-family: ${s.fontFamily}, sans-serif;
        font-size: ${s.fontSize}px;
        color: ${s.color};
        background-color: ${s.backgroundColor};
        opacity: ${s.opacity};
      `;
  }

  // Position classes
  const posClasses = {
      top: "top-10",
      middle: "top-1/2 -translate-y-1/2",
      bottom: "bottom-16"
  };

  // Animation classes (using Tailwind animate utilities or custom CSS)
  const animClasses = {
      none: "",
      fade: "animate-in fade-in duration-300",
      pop: "animate-in zoom-in-50 duration-300",
      slide: "animate-in slide-in-from-bottom-4 duration-300"
  };

</script>

<!-- Overlay Container -->
<div class="absolute inset-0 pointer-events-none overflow-hidden flex justify-center w-full h-full z-20">
    {#if activeSubtitle}
        {#key activeSubtitle.id}
            <div
                class={cn(
                    "absolute px-4 py-2 rounded text-center max-w-[80%] transition-all",
                    posClasses[style.position],
                    animClasses[style.animation]
                )}
                style={getStyleString(style)}
            >
                {activeSubtitle.text}
            </div>
        {/key}
    {/if}
</div>
