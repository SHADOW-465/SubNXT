<script lang="ts">
  import { type SubtitleStyle } from "$lib/stores/projectStore.svelte";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import { Slider } from "$lib/components/ui/slider";
  import { AlignLeft, AlignCenter, AlignRight, AlignVerticalJustifyCenter, AlignVerticalJustifyStart, AlignVerticalJustifyEnd, Type } from "lucide-svelte";
  import { cn } from "$lib/utils";

  let { style, onUpdate } = $props<{
      style: SubtitleStyle,
      onUpdate: (updates: Partial<SubtitleStyle>) => void
  }>();

  const fontOptions = [
      { value: 'Inter', label: 'Inter' },
      { value: 'Arial', label: 'Arial' },
      { value: 'Courier New', label: 'Courier' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Impact', label: 'Impact' },
      { value: 'Times New Roman', label: 'Times' }
  ];

  const animationOptions = [
      { value: 'none', label: 'None' },
      { value: 'fade', label: 'Fade In' },
      { value: 'pop', label: 'Pop Up' },
      { value: 'slide', label: 'Slide Up' }
  ];

  // Colors
  const colors = [
      '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#ccff00'
  ];

</script>

<div class="p-6 space-y-6 text-white">
    <div class="flex items-center gap-2 mb-4">
        <Type class="w-5 h-5 text-[#E5352B]" />
        <h3 class="font-semibold text-lg">Subtitle Styles</h3>
    </div>

    <!-- Font Family -->
    <div class="space-y-3">
        <Label>Font Family</Label>
        <Select.Root type="single" value={style.fontFamily} onValueChange={(v) => onUpdate({ fontFamily: v })}>
            <Select.Trigger class="bg-white/5 border-white/10 text-white">
                {style.fontFamily}
            </Select.Trigger>
            <Select.Content class="bg-[#1a0d0a] border-white/10 text-white">
                {#each fontOptions as font}
                    <Select.Item value={font.value} class="focus:bg-white/10">{font.label}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </div>

    <!-- Font Size -->
    <div class="space-y-3">
        <div class="flex justify-between">
            <Label>Font Size</Label>
            <span class="text-xs text-white/50">{style.fontSize}px</span>
        </div>
        <Slider
            value={[style.fontSize]}
            min={12}
            max={72}
            step={1}
            onValueChange={(v) => onUpdate({ fontSize: v[0] })}
            class="[&>.relative>.absolute]:bg-[#E5352B]"
        />
    </div>

    <!-- Colors -->
    <div class="space-y-3">
        <Label>Text Color</Label>
        <div class="flex flex-wrap gap-2">
            {#each colors as c}
                <button
                    class={cn("w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110", style.color === c && "ring-2 ring-white")}
                    style="background-color: {c}"
                    onclick={() => onUpdate({ color: c })}
                    aria-label="Set text color to {c}"
                ></button>
            {/each}
            <input
                type="color"
                value={style.color}
                oninput={(e) => onUpdate({ color: e.currentTarget.value })}
                class="w-6 h-6 rounded-full overflow-hidden border-0 p-0 cursor-pointer"
                aria-label="Custom text color picker"
            />
        </div>
    </div>

    <div class="space-y-3">
        <Label>Background</Label>
        <div class="flex flex-wrap gap-2">
            <button
                class={cn("w-6 h-6 rounded-full border border-white/20 bg-transparent relative", style.backgroundColor === 'transparent' && "ring-2 ring-white")}
                onclick={() => onUpdate({ backgroundColor: 'transparent' })}
                aria-label="Set transparent background"
            >
                <div class="absolute inset-0 border border-red-500 transform rotate-45"></div>
            </button>
            {#each ['rgba(0,0,0,0.5)', '#000000', '#ffffff', '#E5352B'] as c}
                <button
                    class={cn("w-6 h-6 rounded-full border border-white/20 transition-transform hover:scale-110", style.backgroundColor === c && "ring-2 ring-white")}
                    style="background-color: {c}"
                    onclick={() => onUpdate({ backgroundColor: c })}
                    aria-label="Set background color to {c}"
                ></button>
            {/each}
        </div>
    </div>

    <!-- Position -->
    <div class="space-y-3">
        <Label>Position</Label>
        <div class="flex bg-white/5 rounded-lg p-1 border border-white/10">
            {#each ['top', 'middle', 'bottom'] as pos}
                <button
                    class={cn(
                        "flex-1 py-2 flex items-center justify-center rounded-md transition-all",
                        style.position === pos ? "bg-[#E5352B] text-white shadow-lg" : "text-white/50 hover:text-white"
                    )}
                    onclick={() => onUpdate({ position: pos as any })}
                >
                    {#if pos === 'top'}<AlignVerticalJustifyStart size={16} />{/if}
                    {#if pos === 'middle'}<AlignVerticalJustifyCenter size={16} />{/if}
                    {#if pos === 'bottom'}<AlignVerticalJustifyEnd size={16} />{/if}
                </button>
            {/each}
        </div>
    </div>

    <!-- Animation -->
    <div class="space-y-3">
        <Label>Animation</Label>
         <Select.Root type="single" value={style.animation} onValueChange={(v) => onUpdate({ animation: v as any })}>
            <Select.Trigger class="bg-white/5 border-white/10 text-white">
                {animationOptions.find(o => o.value === style.animation)?.label}
            </Select.Trigger>
            <Select.Content class="bg-[#1a0d0a] border-white/10 text-white">
                {#each animationOptions as anim}
                    <Select.Item value={anim.value} class="focus:bg-white/10">{anim.label}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </div>
</div>
