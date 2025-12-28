<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { projectStore, type Project, type Subtitle, type SubtitleStyle } from "$lib/stores/projectStore.svelte";
  import SubtitleEditorComponent from "$lib/components/editor/subtitle-editor.svelte";
  import { transcribeOffline } from "$lib/services/transcriptionService";

  // Design System
  import LiquidBackground from "$lib/components/ui/liquid/LiquidBackground.svelte";
  import GlassPanel from "$lib/components/ui/liquid/GlassPanel.svelte";
  import LiquidButton from "$lib/components/ui/liquid/LiquidButton.svelte";

  // New Components
  import Timeline from "$lib/components/editor/timeline/Timeline.svelte";
  import StylesPanel from "$lib/components/editor/panels/StylesPanel.svelte";
  import SubtitleOverlay from "$lib/components/editor/video/SubtitleOverlay.svelte";

  // Icons
  import {
    ArrowLeft, Type, Languages, Music, LayoutGrid, User,
    Star, Share2, MoreHorizontal, Sparkles, X, Plus,
    ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward,
    Settings, Grid, Maximize2, Send, Activity, Loader2, Download
  } from 'lucide-svelte';

  let projectId = $page.params.id;
  let mode = $page.url.searchParams.get("mode") as "online" | "offline" || "online";

  let project = $state<Project | undefined>(undefined);
  let isLoading = $state(true);
  let isTranscribing = $state(false);
  let transcriptionProgress = $state(0);
  let transcriptionStatus = $state("");

  // UI State
  let activeTab = $state('subtitles');

  // Video Player State
  let videoEl = $state<HTMLVideoElement>();
  let currentTime = $state(0);
  let duration = $state(0);
  let isPlaying = $state(false);

  let selectedSubtitleId = $state<string | null>(null);

  onMount(async () => {
    if (!projectId) return;

    await projectStore.loadProjects();
    project = await projectStore.getProject(projectId);
    isLoading = false;

    if (project && project.status === 'processing') {
       startTranscription();
    }
  });

  async function startTranscription() {
     if (!project) return;
     isTranscribing = true;

     try {
         if (mode === 'offline') {
             transcriptionStatus = "Loading Local AI...";

             const mediaSource = project.mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

             // Pass targetLanguage if present
             await transcribeOffline(mediaSource, (progress) => {
                 transcriptionProgress = progress;
                 transcriptionStatus = `Processing... ${Math.round(progress)}%`;
             }, (subs) => {
                 if (project) {
                     project.subtitles = subs;
                     project.status = 'completed';
                     projectStore.updateProject(project.id, { subtitles: subs, status: 'completed' });
                 }
                 isTranscribing = false;
             }, project.targetLanguage);

         } else {
             // ... previous online mock ...
             isTranscribing = false;
             // (Assuming online mock logic is redundant now that we enhanced the offline one to call API)
         }

     } catch (e: any) {
         console.error(e);
         transcriptionStatus = "Error: " + (e?.message || 'Unknown error');
         if (project) {
             project.status = 'error';
             projectStore.updateProject(project.id, { status: 'error' });
         }
         isTranscribing = false;
     }
  }

  function togglePlay() {
      if (!videoEl) return;
      if (videoEl.paused) {
          videoEl.play();
          isPlaying = true;
      } else {
          videoEl.pause();
          isPlaying = false;
      }
  }

  function onTimeUpdate() {
      if (!videoEl) return;
      currentTime = videoEl.currentTime;
  }

  function onMetadata() {
      if (!videoEl) return;
      duration = videoEl.duration;
  }

  function handleSeek(time: number) {
      if (videoEl) {
          videoEl.currentTime = time;
          currentTime = time;
      }
  }

  function handleUpdateSub(id: string, updates: Partial<Subtitle>) {
      if (!project) return;
      const subIndex = project.subtitles.findIndex(s => s.id === id);
      if (subIndex > -1) {
          project.subtitles[subIndex] = { ...project.subtitles[subIndex], ...updates };
          projectStore.updateProject(project.id, { subtitles: project.subtitles });
      }
  }

  function handleDeleteSub(id: string) {
       if (!project) return;
       project.subtitles = project.subtitles.filter(s => s.id !== id);
       projectStore.updateProject(project.id, { subtitles: project.subtitles });
  }

  function handleUpdateStyle(updates: Partial<SubtitleStyle>) {
      if (!project) return;
      project.style = { ...project.style, ...updates };
      projectStore.updateProject(project.id, { style: project.style });
  }

</script>

<div class="min-h-screen w-full bg-[#141418] flex items-center justify-center p-4 lg:p-10 font-sans selection:bg-orange-500/30 overflow-hidden relative">
  <LiquidBackground />

  <!-- Main Editor Panel -->
  <GlassPanel class="w-full max-w-7xl h-[90vh] flex flex-col">
    {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center text-white">
            <Loader2 class="h-8 w-8 animate-spin text-[#d69e2e]" />
        </div>
    {:else if project}
        <!-- Top Navigation Layer -->
        <div class="relative h-24 z-30 p-6 flex justify-between items-start pointer-events-none shrink-0">
          <LiquidButton size="lg" class="pointer-events-auto !bg-[#4A241B]/80 !border-[#E5352B]/30" onclick={() => window.history.back()}>
            <ArrowLeft size={24} />
          </LiquidButton>

          <div class="pointer-events-auto px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center transform hover:bg-white/10 transition-all cursor-default">
            <span class="text-white text-sm font-medium tracking-wide">{project.name}</span>
          </div>

          <div class="pointer-events-auto flex items-center space-x-3">
            <LiquidButton onclick={() => projectStore.saveProjects()}><Star size={18} /></LiquidButton>
            <LiquidButton><Share2 size={18} /></LiquidButton>
            <LiquidButton onclick={() => alert("Exporting...")}><Download size={18} /></LiquidButton>
          </div>
        </div>

        <!-- Middle Area (Tools + Canvas + Panels) -->
        <div class="flex-1 flex overflow-hidden relative">

            <!-- Left Toolbar -->
            <div class="w-24 flex flex-col items-center space-y-4 pt-4 z-30">
                {#each [
                    { id: 'subtitles', icon: Type, label: "Subtitles" },
                    { id: 'styles', icon: Sparkles, label: "Styles" },
                    { id: 'translate', icon: Languages, label: "Translate" },
                    { id: 'media', icon: LayoutGrid, label: "Media" }
                ] as tool (tool.id)}
                    <LiquidButton
                    active={activeTab === tool.id}
                    size="lg"
                    onclick={() => activeTab = tool.id}
                    class="pointer-events-auto"
                    >
                    <tool.icon size={20} strokeWidth={2.5} />
                    </LiquidButton>
                {/each}
            </div>

            <!-- Canvas Area (Center) -->
            <div class="flex-1 relative bg-black flex items-center justify-center overflow-hidden rounded-2xl mx-2 border border-white/5">
                 <!-- Background Ambient Glow -->
                 <div class="absolute inset-0 opacity-40 pointer-events-none" style="background: radial-gradient(circle at 35% 45%, #e5352b 0%, #3a1c14 30%, #1a0d0a 60%);"></div>

                 <!-- Loader Overlay -->
                 {#if isTranscribing}
                     <div class="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm text-white">
                        <Loader2 class="h-10 w-10 animate-spin text-[#d69e2e] mb-4" />
                        <h3 class="text-xl font-semibold mb-2">{transcriptionStatus}</h3>
                        <div class="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full bg-[#E5352B] transition-all duration-300" style="width: {transcriptionProgress}%"></div>
                        </div>
                     </div>
                 {/if}

                 <div class="relative max-h-[90%] max-w-[90%] z-10 shadow-2xl rounded-lg overflow-hidden">
                    <!-- Overlay Component -->
                     <SubtitleOverlay
                        subtitles={project.subtitles}
                        style={project.style}
                        currentTime={currentTime}
                     />

                     <!-- svelte-ignore a11y_media_has_caption -->
                     <video
                        bind:this={videoEl}
                        src={project.mediaUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                        class="block max-h-full max-w-full"
                        ontimeupdate={onTimeUpdate}
                        onloadedmetadata={onMetadata}
                     ></video>
                 </div>
            </div>

            <!-- Right Panel (Contextual) -->
            <div class="w-[400px] bg-[#2d150f]/40 backdrop-blur-[30px] border-l border-white/15 shadow-[-32px_0_64px_rgba(0,0,0,0.6)] flex flex-col z-20">
                 {#if activeTab === 'subtitles'}
                    <div class="p-6 border-b border-white/10 flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                                <Type size={14} class="text-white" />
                            </div>
                            <span class="text-white font-medium text-sm tracking-wide">Subtitles</span>
                        </div>
                    </div>
                    <SubtitleEditorComponent
                        subtitles={project.subtitles}
                        selectedSubtitleId={selectedSubtitleId}
                        currentTime={currentTime}
                        onSelect={(id) => {
                             selectedSubtitleId = id;
                             const sub = project.subtitles.find(s => s.id === id);
                             if (sub) handleSeek(sub.startTime);
                        }}
                        onUpdate={handleUpdateSub}
                        onDelete={handleDeleteSub}
                        onSeek={handleSeek}
                    />
                 {:else if activeTab === 'styles'}
                    <StylesPanel
                        style={project.style}
                        onUpdate={handleUpdateStyle}
                    />
                 {:else}
                    <div class="flex-1 flex items-center justify-center text-white/50">
                        Feature coming soon
                    </div>
                 {/if}
            </div>
        </div>

        <!-- Timeline Overlay (Bottom) -->
        <div class="h-48 z-40 shrink-0 border-t border-white/10">
           <!-- Timeline Component -->
           <Timeline
              subtitles={project.subtitles}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              onUpdate={handleUpdateSub}
              onSelect={(id) => selectedSubtitleId = id}
              selectedSubtitleId={selectedSubtitleId}
           />

           <!-- Playback Controls (Inside Timeline or separate? Reference shows them below.
                My Timeline component handles controls inside itself now or we overlay them?
                Actually, the reference has timeline separate from controls.
                Let's reuse the controls from previous design but positioned nicely.
            -->
            <div class="absolute bottom-4 left-6 flex items-center space-x-4 z-50 pointer-events-auto">
                 <LiquidButton onclick={() => handleSeek(currentTime - 5)}><SkipBack size={18} fill="currentColor" /></LiquidButton>
                <LiquidButton size="lg" class="!bg-white/15 hover:!bg-white/25" onclick={togglePlay}>
                  {#if isPlaying}
                     <Pause size={26} fill="currentColor" class="ml-1" />
                  {:else}
                     <Play size={26} fill="currentColor" class="ml-1" />
                  {/if}
                </LiquidButton>
                <LiquidButton onclick={() => handleSeek(currentTime + 5)}><SkipForward size={18} fill="currentColor" /></LiquidButton>
            </div>
        </div>
    {:else}
        <div class="flex items-center justify-center h-full text-white">
            Project not found.
        </div>
    {/if}
  </GlassPanel>

  <style>
    :global(.custom-scrollbar::-webkit-scrollbar) {
        width: 4px;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-track) {
        background: transparent;
    }
    :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
    }
  </style>
</div>
