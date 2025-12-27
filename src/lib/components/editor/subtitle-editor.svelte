<script lang="ts">
  import { cn } from "$lib/utils";
  import { Badge } from "$lib/components/ui/badge";
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { MoreVertical, Trash2, Split, AlertCircle, Merge } from "lucide-svelte";
  import { type Subtitle } from "$lib/stores/projectStore.svelte";

  let {
      subtitles = [],
      selectedSubtitleId = null,
      currentTime = 0,
      onSelect,
      onUpdate,
      onDelete,
      onSeek
  } = $props<{
      subtitles: Subtitle[],
      selectedSubtitleId: string | null,
      currentTime: number,
      onSelect: (id: string | null) => void,
      onUpdate: (id: string, updates: Partial<Subtitle>) => void,
      onDelete: (id: string) => void,
      onSeek: (time: number) => void
  }>();

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  }

  function parseTime(timeStr: string): number {
    const parts = timeStr.split(":");
    if (parts.length !== 2) return 0;
    const [mins, rest] = parts;
    const [secs, ms = "0"] = rest.split(".");
    return Number.parseInt(mins) * 60 + Number.parseInt(secs) + Number.parseInt(ms) / 100;
  }

  function getConfidenceColor(confidence: number = 1) {
    if (confidence >= 0.9) return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]";
    if (confidence >= 0.7) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]";
    return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]";
  }

  let scrollContainer: HTMLDivElement;

  $effect(() => {
      const currentSub = subtitles.find((s: Subtitle) => currentTime >= s.startTime && currentTime <= s.endTime);
      if (currentSub && scrollContainer) {
          const el = document.getElementById(`subtitle-${currentSub.id}`);
          if (el) {
              // Smooth scroll handled by browser or parent container usually
          }
      }
  });

</script>

<div class="flex-1 overflow-y-auto p-2 pr-4 custom-scrollbar" bind:this={scrollContainer}>
  {#each subtitles as subtitle, index (subtitle.id)}
    {@const isActive = currentTime >= subtitle.startTime && currentTime <= subtitle.endTime}
    {@const isSelected = selectedSubtitleId === subtitle.id}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      id="subtitle-{subtitle.id}"
      class={cn(
        "group mb-4 rounded-[20px] border p-4 transition-all duration-300 cursor-pointer relative overflow-hidden",
        isActive
          ? "bg-[#E5352B]/10 border-[#E5352B]/40 shadow-[0_0_20px_rgba(229,53,43,0.15)] scale-[1.02]"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]",
        isSelected && "ring-1 ring-[#E5352B]/50",
      )}
      onclick={() => {
        onSelect(subtitle.id);
        onSeek(subtitle.startTime);
      }}
    >
      <!-- Active Gradient Overlay -->
      {#if isActive}
        <div class="absolute inset-0 bg-gradient-to-r from-[#E5352B]/5 to-transparent pointer-events-none"></div>
      {/if}

      <div class="relative z-10 mb-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-mono text-white/40 tracking-wider">#{String(index + 1).padStart(2, '0')}</span>
          <div class={cn("h-1.5 w-1.5 rounded-full", getConfidenceColor(subtitle.confidence))}></div>
          {#if subtitle.speaker}
            <Badge variant="secondary" class="bg-white/10 text-white/80 hover:bg-white/20 border-white/5 text-[10px] h-5">
              {subtitle.speaker}
            </Badge>
          {/if}
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              onclick={(e) => e.stopPropagation()}
            >
              <MoreVertical class="h-3 w-3" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" class="bg-[#1a0d0a] border-white/10 text-white">
            <DropdownMenu.Item class="focus:bg-white/10 focus:text-white cursor-pointer">
              <Split class="mr-2 h-4 w-4" />
              Split Subtitle
            </DropdownMenu.Item>
            <DropdownMenu.Item disabled={index === subtitles.length - 1} class="focus:bg-white/10 focus:text-white cursor-pointer">
              <Merge class="mr-2 h-4 w-4" />
              Merge with Next
            </DropdownMenu.Item>
            <DropdownMenu.Item
              class="text-red-400 focus:text-red-300 focus:bg-red-900/20 cursor-pointer"
              onclick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(subtitle.id);
              }}
            >
              <Trash2 class="mr-2 h-4 w-4" />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <div class="relative z-10 mb-3 flex items-center gap-2 text-xs">
        <div class="flex items-center bg-black/20 rounded-lg p-1 border border-white/5">
            <input
            value={formatTime(subtitle.startTime)}
            onchange={(e) => {
                const val = e.currentTarget.value;
                const time = parseTime(val);
                if (!isNaN(time)) onUpdate(subtitle.id, { startTime: time });
            }}
            class="h-5 w-16 bg-transparent text-center text-[10px] font-mono text-white/70 focus:text-white focus:outline-none"
            onclick={(e) => e.stopPropagation()}
            />
        </div>
        <span class="text-white/20">→</span>
        <div class="flex items-center bg-black/20 rounded-lg p-1 border border-white/5">
            <input
            value={formatTime(subtitle.endTime)}
            onchange={(e) => {
                const val = e.currentTarget.value;
                const time = parseTime(val);
                if (!isNaN(time)) onUpdate(subtitle.id, { endTime: time });
            }}
            class="h-5 w-16 bg-transparent text-center text-[10px] font-mono text-white/70 focus:text-white focus:outline-none"
            onclick={(e) => e.stopPropagation()}
            />
        </div>
      </div>

      <div class="relative z-10">
          <textarea
            value={subtitle.text}
            oninput={(e) => onUpdate(subtitle.id, { text: e.currentTarget.value })}
            class="w-full min-h-[60px] bg-black/10 rounded-lg border border-white/5 p-3 text-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-white/20 focus:bg-black/20 transition-all resize-none leading-relaxed"
            onclick={(e) => e.stopPropagation()}
          ></textarea>
      </div>
    </div>
  {/each}
</div>
