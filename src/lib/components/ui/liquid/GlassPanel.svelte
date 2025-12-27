<script lang="ts">
  import { cn } from "$lib/utils";

  let { children, class: className = "" } = $props();
</script>

<div class={cn(
  "bg-gradient-to-br from-[#3A1C14] to-[#1a0d0a] rounded-[32px] shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col border border-white/10 relative",
  className
)}>
  {@render children()}
</div>
