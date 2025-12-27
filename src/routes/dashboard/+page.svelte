<script lang="ts">
  import { Plus, Video, Clock, MoreVertical, Search, FileVideo, Sparkles } from "lucide-svelte";
  import { Badge } from "$lib/components/ui/badge";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import UploadModal from "$lib/components/dashboard/upload-modal.svelte";
  import { projectStore } from "$lib/stores/projectStore.svelte";
  import { onMount } from "svelte";

  // Liquid Design System
  import LiquidBackground from "$lib/components/ui/liquid/LiquidBackground.svelte";
  import LiquidButton from "$lib/components/ui/liquid/LiquidButton.svelte";
  import GlassPanel from "$lib/components/ui/liquid/GlassPanel.svelte";
  import { Button } from "$lib/components/ui/button"; // Keep for dropdown triggers if needed or replace

  let isUploadModalOpen = $state(false);
  let searchQuery = $state("");

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Derived state for filtered projects
  let filteredProjects = $derived(
    projectStore.projects.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  onMount(() => {
    projectStore.loadProjects();
  });
</script>

<div class="min-h-screen w-full bg-[#141418] p-4 lg:p-10 font-sans selection:bg-orange-500/30 overflow-hidden relative">
  <LiquidBackground />

  <div class="relative z-10 mx-auto max-w-7xl flex flex-col h-[90vh]">
    <!-- Header -->
    <div class="mb-12 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5352B] to-[#3A1C14] flex items-center justify-center shadow-[0_0_20px_rgba(229,53,43,0.3)]">
             <Sparkles size={24} class="text-white" />
        </div>
        <div>
            <h1 class="text-3xl font-bold text-white tracking-wide">Dashboard</h1>
            <p class="text-white/40 text-sm font-light">Manage your creations</p>
        </div>
      </div>

      <!-- Action -->
      <button
        onclick={() => (isUploadModalOpen = true)}
        class="group relative pl-4 pr-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-white/10 hover:scale-105 transition-all flex items-center space-x-3 overflow-hidden"
      >
        <div class="absolute inset-0 bg-gradient-to-tr from-[#E5352B]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="w-8 h-8 rounded-full bg-[#E5352B] flex items-center justify-center shadow-lg">
             <Plus size={18} class="text-white" />
        </div>
        <span class="text-white font-medium tracking-wide">New Project</span>
      </button>
    </div>

    <!-- Search and Filter Bar -->
    <div class="mb-10 flex items-center gap-6">
      <div class="relative flex-1 max-w-md group">
        <div class="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative flex items-center bg-[#2d150f]/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-3 shadow-inner focus-within:border-white/20 focus-within:bg-white/5 transition-all">
            <Search class="h-5 w-5 text-white/40 mr-3" />
            <input
            type="text"
            placeholder="Search projects..."
            class="w-full bg-transparent text-white placeholder:text-white/20 focus:outline-none text-sm font-light"
            bind:value={searchQuery}
            />
        </div>
      </div>
    </div>

    {#if projectStore.isLoading}
        <div class="flex justify-center p-20">
            <div class="h-10 w-10 animate-spin rounded-full border-2 border-[#E5352B] border-t-transparent shadow-[0_0_20px_rgba(229,53,43,0.4)]"></div>
        </div>
    {:else if filteredProjects.length === 0}
      <GlassPanel class="flex flex-col items-center justify-center py-32 text-center !bg-[#2d150f]/20">
        <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
          <FileVideo class="h-8 w-8 text-[#E5352B]/60" />
        </div>
        <h3 class="mb-3 text-2xl font-medium text-white">No projects yet</h3>
        <p class="mb-8 max-w-sm text-white/40 font-light leading-relaxed">
          Upload a video to get started with <br/> AI-powered subtitles.
        </p>
        <LiquidButton size="lg" onclick={() => (isUploadModalOpen = true)}>
             <Plus size={20} />
        </LiquidButton>
      </GlassPanel>
    {:else}
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-auto pb-10 pr-2 custom-scrollbar">
        {#each filteredProjects as project (project.id)}
          <a href="/editor/{project.id}" class="block group relative">
             <!-- Card Container -->
             <div class="relative h-[280px] w-full rounded-[32px] overflow-hidden bg-[#2d150f]/20 backdrop-blur-md border border-white/10 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] group-hover:border-white/20">

                 <!-- Image / Thumbnail Area -->
                 <div class="h-[60%] w-full bg-black relative overflow-hidden group-hover:h-[65%] transition-all duration-500">
                     <div class="absolute inset-0 bg-gradient-to-t from-[#2d150f]/80 to-transparent z-10"></div>
                     <div class="absolute inset-0 flex items-center justify-center">
                         <!-- Fallback Icon if no image -->
                         <Video class="h-10 w-10 text-white/10" />
                     </div>

                     <div class="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-white/80 font-mono">
                        {formatDate(project.createdAt)}
                     </div>
                 </div>

                 <!-- Content Area -->
                 <div class="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-b from-transparent to-[#1a0d0a]/80 p-6 flex flex-col justify-end group-hover:h-[35%] transition-all duration-500">
                    <div class="flex justify-between items-start mb-2">
                         <h3 class="font-medium text-lg text-white truncate pr-4 group-hover:text-[#E5352B] transition-colors tracking-wide">{project.name}</h3>

                         <!-- Actions Dropdown -->
                         <!-- svelte-ignore a11y_click_events_have_key_events -->
                         <!-- svelte-ignore a11y_no_static_element_interactions -->
                         <div onclick={(e) => e.preventDefault()}>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger class="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div class="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                                        <MoreVertical class="h-4 w-4 text-white" />
                                    </div>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content align="end" class="bg-[#1a0d0a] border-white/10 text-white">
                                <DropdownMenu.Item onclick={(e) => { projectStore.deleteProject(project.id); }} class="text-red-400 focus:bg-white/10 focus:text-red-300 cursor-pointer">
                                    Delete
                                </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                         </div>
                    </div>

                    <div class="flex items-center gap-3">
                         <Badge variant="outline" class="border-[#E5352B]/30 bg-[#E5352B]/10 text-[#E5352B] text-[10px] px-2 py-0.5 h-auto">
                            {project.status.toUpperCase()}
                         </Badge>
                         <span class="text-white/20 text-[10px]">•</span>
                         <span class="flex items-center gap-1 text-white/40 text-xs">
                            <Clock class="h-3 w-3" />
                            {new Date(project.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                         </span>
                    </div>
                 </div>

                 <!-- Hover Glow -->
                 <div class="absolute inset-0 border border-white/0 rounded-[32px] group-hover:border-white/10 transition-colors pointer-events-none"></div>
             </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

<UploadModal bind:open={isUploadModalOpen} />

<style>
    :global(.custom-scrollbar::-webkit-scrollbar) {
        width: 4px;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-track) {
        background: transparent;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
    }
</style>
