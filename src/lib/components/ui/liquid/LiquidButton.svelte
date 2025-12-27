<script lang="ts">
  import { cn } from "$lib/utils";

  let {
    children,
    class: className = "",
    active = false,
    size = "md",
    onclick,
    type = "button"
  } = $props();

  const sizeClasses = {
    sm: "w-9 h-9",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const activeClasses =
    "bg-white/90 text-[#3A1C14] shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)] scale-110";

  const inactiveClasses =
    "bg-white/10 text-white/80 backdrop-blur-xl border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-95";

</script>

<button
  {type}
  {onclick}
  class={cn(
    sizeClasses[size as keyof typeof sizeClasses] || "w-10 h-10",
    "flex items-center justify-center rounded-full transition-all duration-500 relative group",
    active ? activeClasses : inactiveClasses,
    className
  )}
>
  {#if !active}
    <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
  {/if}
  {@render children()}
</button>
