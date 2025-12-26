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
    if (confidence >= 0.9) return "bg-green-500";
    if (confidence >= 0.7) return "bg-yellow-500";
    return "bg-red-500";
  }

  let scrollContainer: HTMLDivElement;

  $effect(() => {
      const currentSub = subtitles.find((s: Subtitle) => currentTime >= s.startTime && currentTime <= s.endTime);
      if (currentSub && scrollContainer) {
          const el = document.getElementById(`subtitle-${currentSub.id}`);
          if (el) {
               // Optional: only scroll if out of view
              // el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
      }
  });

</script>

<div class="flex-1 overflow-y-auto p-2" bind:this={scrollContainer}>
  {#each subtitles as subtitle, index (subtitle.id)}
    {@const isActive = currentTime >= subtitle.startTime && currentTime <= subtitle.endTime}
    {@const isSelected = selectedSubtitleId === subtitle.id}

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      id="subtitle-{subtitle.id}"
      class={cn(
        "group mb-2 rounded-lg border p-3 transition-all cursor-pointer",
        isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
        isSelected && "ring-2 ring-primary ring-offset-2",
      )}
      onclick={() => {
        onSelect(subtitle.id);
        onSeek(subtitle.startTime);
      }}
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xs text-muted-foreground">#{index + 1}</span>
          <div class={cn("h-2 w-2 rounded-full", getConfidenceColor(subtitle.confidence))}></div>
          {#if subtitle.speaker}
            <Badge variant="secondary" class="text-xs">
              {subtitle.speaker}
            </Badge>
          {/if}
          {#if (subtitle.confidence || 1) < 0.9}
             <AlertCircle class="h-3 w-3 text-yellow-500" />
          {/if}
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 opacity-0 group-hover:opacity-100"
              onclick={(e) => e.stopPropagation()}
            >
              <MoreVertical class="h-3 w-3" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end">
            <DropdownMenu.Item>
              <Split class="mr-2 h-4 w-4" />
              Split Subtitle
            </DropdownMenu.Item>
            <DropdownMenu.Item disabled={index === subtitles.length - 1}>
              <Merge class="mr-2 h-4 w-4" />
              Merge with Next
            </DropdownMenu.Item>
            <DropdownMenu.Item
              class="text-destructive"
              onclick={(e) => {
                e.preventDefault(); // prevent closing if needed, or allow
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

      <div class="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <input
          value={formatTime(subtitle.startTime)}
          onchange={(e) => {
             const val = e.currentTarget.value;
             const time = parseTime(val);
             if (!isNaN(time)) onUpdate(subtitle.id, { startTime: time });
          }}
          class="h-6 w-20 px-1 text-center text-xs bg-transparent border rounded"
          onclick={(e) => e.stopPropagation()}
        />
        <span>→</span>
        <input
          value={formatTime(subtitle.endTime)}
          onchange={(e) => {
             const val = e.currentTarget.value;
             const time = parseTime(val);
             if (!isNaN(time)) onUpdate(subtitle.id, { endTime: time });
          }}
          class="h-6 w-20 px-1 text-center text-xs bg-transparent border rounded"
          onclick={(e) => e.stopPropagation()}
        />
      </div>

      <Textarea
        value={subtitle.text}
        oninput={(e) => onUpdate(subtitle.id, { text: e.currentTarget.value })}
        class="min-h-[60px] resize-none text-sm bg-transparent"
        onclick={(e) => e.stopPropagation()}
      />
    </div>
  {/each}
</div>
