<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Plus, Video, Clock, MoreVertical, Search, FileVideo } from "lucide-svelte";
  import { Badge } from "$lib/components/ui/badge";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import UploadModal from "$lib/components/dashboard/upload-modal.svelte";
  import { projectStore } from "$lib/stores/projectStore.svelte";
  import { onMount } from "svelte";

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

<div class="min-h-screen bg-[#090b0f] p-8 text-white">
  <div class="mx-auto max-w-7xl">
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="text-muted-foreground">Manage your subtitle projects</p>
      </div>
      <Button onclick={() => (isUploadModalOpen = true)} class="bg-gradient-to-r from-[#d69e2e] to-[#d69e2e]/80 text-black hover:from-[#d69e2e]/90 hover:to-[#d69e2e]/70">
        <Plus class="mr-2 h-4 w-4" /> New Project
      </Button>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6 flex items-center gap-4">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search projects..."
          class="h-10 w-full rounded-md border border-white/10 bg-white/5 pl-9 pr-4 text-sm focus:border-[#d69e2e] focus:outline-none focus:ring-1 focus:ring-[#d69e2e]"
          bind:value={searchQuery}
        />
      </div>
    </div>

    {#if projectStore.isLoading}
        <div class="flex justify-center p-12">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-[#d69e2e] border-t-transparent"></div>
        </div>
    {:else if filteredProjects.length === 0}
      <div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/5 py-20 text-center">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a365d]/20">
          <FileVideo class="h-8 w-8 text-[#d69e2e]" />
        </div>
        <h3 class="mb-2 text-xl font-semibold">No projects yet</h3>
        <p class="mb-6 max-w-sm text-muted-foreground">
          Upload a video to get started with AI-powered subtitles.
        </p>
        <Button onclick={() => (isUploadModalOpen = true)} variant="outline" class="border-white/20 hover:bg-white/10">
          Create Project
        </Button>
      </div>
    {:else}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each filteredProjects as project (project.id)}
          <a href="/editor/{project.id}" class="block group">
            <Card.Root class="overflow-hidden border-white/10 bg-white/5 transition-all hover:border-[#d69e2e]/50 hover:shadow-lg hover:shadow-[#d69e2e]/5">
              <div class="aspect-video w-full bg-[#000] relative flex items-center justify-center">
                 <!-- Placeholder for video thumbnail -->
                 <Video class="h-12 w-12 text-white/20" />
                 <div class="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                    {formatDate(project.createdAt)}
                 </div>
              </div>
              <Card.Content class="p-4">
                <div class="mb-2 flex items-center justify-between">
                  <h3 class="font-semibold truncate pr-4 text-white group-hover:text-[#d69e2e] transition-colors">{project.name}</h3>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger class="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" class="h-8 w-8">
                            <MoreVertical class="h-4 w-4" />
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                      <DropdownMenu.Item onclick={(e) => { e.preventDefault(); projectStore.deleteProject(project.id); }}>
                        Delete
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                   <Badge variant="outline" class="border-white/20 text-xs">{project.status}</Badge>
                   <span>•</span>
                   <span class="flex items-center gap-1"><Clock class="h-3 w-3" /> {new Date(project.updatedAt).toLocaleTimeString()}</span>
                </div>
              </Card.Content>
            </Card.Root>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>

<UploadModal bind:open={isUploadModalOpen} />
