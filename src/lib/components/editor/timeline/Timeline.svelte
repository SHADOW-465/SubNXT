<script lang="ts">
  import { onMount } from "svelte";
  import { type Subtitle } from "$lib/stores/projectStore.svelte";
  import { cn } from "$lib/utils";
  import { ChevronLeft, ChevronRight, Plus } from "lucide-svelte";

  let {
      subtitles = [],
      currentTime = 0,
      duration = 60,
      onSeek,
      onUpdate,
      onSelect,
      selectedSubtitleId
  } = $props<{
      subtitles: Subtitle[],
      currentTime: number,
      duration: number,
      onSeek: (time: number) => void,
      onUpdate: (id: string, updates: Partial<Subtitle>) => void,
      onSelect: (id: string | null) => void,
      selectedSubtitleId: string | null
  }>();

  // Timeline Scale (pixels per second)
  // Adjust this to zoom in/out
  let pixelsPerSecond = $state(20);

  // Container ref
  let container: HTMLDivElement;
  let isDragging = false;
  let dragMode: 'move' | 'start' | 'end' | null = null;
  let dragTargetId: string | null = null;
  let startX = 0;
  let initialStartTime = 0;
  let initialEndTime = 0;

  // Render rulers
  function getRulerMarks() {
     const marks = [];
     const totalSeconds = Math.max(duration, 60); // Min 1 min ruler
     for (let i = 0; i <= totalSeconds; i += 5) { // Mark every 5 seconds
         marks.push(i);
     }
     return marks;
  }

  function handleMouseDown(e: MouseEvent, sub: Subtitle, mode: 'move' | 'start' | 'end') {
      e.stopPropagation();
      isDragging = true;
      dragMode = mode;
      dragTargetId = sub.id;
      startX = e.clientX;
      initialStartTime = sub.startTime;
      initialEndTime = sub.endTime;
      onSelect(sub.id);

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
      if (!isDragging || !dragTargetId) return;

      const deltaPixels = e.clientX - startX;
      const deltaTime = deltaPixels / pixelsPerSecond;

      const sub = subtitles.find(s => s.id === dragTargetId);
      if (!sub) return;

      if (dragMode === 'move') {
          let newStart = initialStartTime + deltaTime;
          let newEnd = initialEndTime + deltaTime;

          // Clamping
          if (newStart < 0) {
              newStart = 0;
              newEnd = initialEndTime - initialStartTime;
          }

          onUpdate(dragTargetId, { startTime: newStart, endTime: newEnd });
      } else if (dragMode === 'start') {
          let newStart = initialStartTime + deltaTime;
          if (newStart < 0) newStart = 0;
          if (newStart >= sub.endTime - 0.2) newStart = sub.endTime - 0.2; // Min duration

          onUpdate(dragTargetId, { startTime: newStart });
      } else if (dragMode === 'end') {
          let newEnd = initialEndTime + deltaTime;
          if (newEnd <= sub.startTime + 0.2) newEnd = sub.startTime + 0.2;

          onUpdate(dragTargetId, { endTime: newEnd });
      }
  }

  function handleMouseUp() {
      isDragging = false;
      dragMode = null;
      dragTargetId = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
  }

  function handleTimelineClick(e: MouseEvent) {
      if (isDragging) return;
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left + container.scrollLeft;
      const time = clickX / pixelsPerSecond;
      if (time >= 0 && time <= duration) {
          onSeek(time);
      }
  }

</script>

<!-- Timeline Container -->
<div class="relative w-full h-full bg-gradient-to-t from-[#1a0d0a] via-[#3A1C14]/40 to-transparent backdrop-blur-[8px] flex flex-col justify-end overflow-hidden select-none">

    <!-- Ruler Area -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="relative w-full h-12 mb-4 overflow-x-auto no-scrollbar cursor-pointer"
        bind:this={container}
        onmousedown={handleTimelineClick}
    >
       <div
          class="relative h-full"
          style="width: {Math.max(duration, 60) * pixelsPerSecond + 200}px;"
       >
          <!-- Base Line -->
          <div class="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 pointer-events-none"></div>

          <!-- Ruler Marks -->
          {#each getRulerMarks() as t}
            <div class="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none" style="left: {t * pixelsPerSecond}px;">
                <span class="text-[10px] text-white/30 mb-2 font-mono tracking-tighter">{t}s</span>
                <div class={cn("w-[1px] bg-white/10", t % 10 === 0 ? "h-3" : "h-1.5")}></div>
            </div>
          {/each}

          <!-- Playhead -->
          <div
            class="absolute top-0 bottom-0 w-[2px] bg-[#ccff00] z-20 pointer-events-none shadow-[0_0_10px_rgba(204,255,0,0.5)]"
            style="left: {currentTime * pixelsPerSecond}px;"
          >
             <div class="absolute -top-1 -left-[5px] w-3 h-3 bg-[#ccff00] rounded-full shadow-lg"></div>
          </div>

          <!-- Clips Track -->
          <div class="absolute top-6 bottom-0 left-0 right-0">
             {#each subtitles as sub (sub.id)}
                {@const left = sub.startTime * pixelsPerSecond}
                {@const width = (sub.endTime - sub.startTime) * pixelsPerSecond}
                {@const isSelected = selectedSubtitleId === sub.id}

                <!-- Clip Item -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class={cn(
                        "absolute h-10 top-0 rounded-full border flex items-center overflow-visible group cursor-pointer transition-colors",
                        isSelected
                            ? "bg-[#ccff00]/20 border-[#ccff00] z-10"
                            : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-white/40"
                    )}
                    style="left: {left}px; width: {width}px;"
                    onmousedown={(e) => handleMouseDown(e, sub, 'move')}
                >
                    <!-- Text Preview -->
                    <div class="px-3 overflow-hidden text-xs text-white truncate pointer-events-none w-full text-center">
                        {sub.text}
                    </div>

                    <!-- Handles (Only visible on hover or select) -->
                    {#if isSelected}
                        <!-- Left Handle -->
                        <div
                            class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#ccff00] rounded-full flex items-center justify-center text-black cursor-ew-resize shadow-md z-20 hover:scale-110 transition-transform"
                            onmousedown={(e) => handleMouseDown(e, sub, 'start')}
                        >
                            <ChevronLeft size={12} strokeWidth={3} />
                        </div>

                        <!-- Right Handle -->
                        <div
                            class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#ccff00] rounded-full flex items-center justify-center text-black cursor-ew-resize shadow-md z-20 hover:scale-110 transition-transform"
                            onmousedown={(e) => handleMouseDown(e, sub, 'end')}
                        >
                            <ChevronRight size={12} strokeWidth={3} />
                        </div>

                        <!-- Center Line/Marker -->
                        <div class="absolute top-0 bottom-0 left-1/2 w-[1px] bg-[#ccff00]/50 pointer-events-none"></div>
                    {/if}
                </div>
             {/each}
          </div>
       </div>
    </div>

    <!-- Zoom Controls / Bottom Bar -->
    <div class="h-14 border-t border-white/10 flex items-center justify-between px-6 bg-[#0a0504]/50 backdrop-blur-xl">
         <div class="flex items-center space-x-4 text-xs text-white/50">
             <span>Zoom</span>
             <input type="range" min="5" max="100" bind:value={pixelsPerSecond} class="accent-[#ccff00] h-1 w-24 bg-white/10 rounded-lg appearance-none cursor-pointer" />
         </div>

         <div class="flex items-center space-x-2">
             <div class="text-[#ccff00] font-mono text-xs font-bold">
                 {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
             </div>
             <div class="text-white/30 text-xs">/ {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</div>
         </div>
    </div>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
