<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as Dialog from "$lib/components/ui/dialog";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import * as Tabs from "$lib/components/ui/tabs";
  import { Progress } from "$lib/components/ui/progress";
  import { Upload, Link, Loader2, FileVideo, X } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { projectStore, type Project } from "$lib/stores/projectStore.svelte";
  import { Switch } from "$lib/components/ui/switch";

  let { open = $bindable(false) } = $props();

  let isDragging = $state(false);
  let file = $state<File | null>(null);
  let url = $state("");
  let language = $state("auto");
  let preset = $state("youtube");
  let isUploading = $state(false);
  let uploadProgress = $state(0);
  let isProcessing = $state(false);
  let processingStage = $state("");

  // New Toggle
  let useOnlineMode = $state(true);

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const droppedFile = e.dataTransfer?.files[0];
    if (droppedFile && (droppedFile.type.startsWith("video/") || droppedFile.type.startsWith("audio/"))) {
      file = droppedFile;
    }
  }

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      file = selectedFile;
    }
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function resetState() {
    file = null;
    url = "";
    uploadProgress = 0;
    isUploading = false;
    isProcessing = false;
    processingStage = "";
  }

  async function handleSubmit() {
    if (!file && !url) return;

    // Create Project Draft
    const projectId = crypto.randomUUID();
    let mediaUrl = url;
    if (!mediaUrl && file) {
        mediaUrl = URL.createObjectURL(file);
    }

    const newProject: Project = {
        id: projectId,
        name: file ? file.name : "URL Import",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "processing",
        mediaType: "video",
        subtitles: [],
        language: language,
        mediaUrl: mediaUrl || undefined
    };

    setIsUploading(true);

    // Simulate upload
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      uploadProgress = i;
    }

    setIsUploading(false);
    setIsProcessing(true);
    processingStage = useOnlineMode ? "Preparing online AI..." : "Loading local AI model...";

    await projectStore.addProject(newProject);

    // Force a save to ensure persistence before navigation
    await projectStore.saveProjects();

    // Navigate to editor immediately, passing the file context via state or store if possible,
    // or we can redirect to a route that handles the processing.
    // For this architecture, let's redirect to the editor, and the editor will pick up the processing
    // based on the 'status: processing' flag and the file availability.

    // HOWEVER, passing the File object to the next route is tricky without a global store that holds non-serializable data.
    // We will attach the file to the project object in memory temporarily.
    // In a real app, this file would be uploaded to /api/upload and the server returns a URL.

    // Let's perform the "transcription trigger" here before redirecting, or pass it to a store.
    // We'll create a transient store for the active file.

    // For now:
    open = false;
    goto(`/editor/${projectId}?mode=${useOnlineMode ? 'online' : 'offline'}`);
    resetState();
  }

  function setIsUploading(val: boolean) { isUploading = val; }
  function setIsProcessing(val: boolean) { isProcessing = val; }

</script>

<Dialog.Root bind:open={open}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>Create New Project</Dialog.Title>
      <Dialog.Description>Upload a video or audio file to generate AI subtitles.</Dialog.Description>
    </Dialog.Header>

    {#if isProcessing}
      <div class="flex flex-col items-center py-8">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>
        <h3 class="mb-2 text-lg font-semibold">Processing Your Video</h3>
        <p class="text-sm text-muted-foreground">{processingStage}</p>
      </div>
    {:else if isUploading}
      <div class="py-8">
        <div class="mb-4 flex items-center gap-3">
          <FileVideo class="h-10 w-10 text-primary" />
          <div class="flex-1">
            <p class="font-medium">{file?.name}</p>
            <p class="text-sm text-muted-foreground">{file && formatFileSize(file.size)}</p>
          </div>
        </div>
        <Progress value={uploadProgress} class="h-2" />
        <p class="mt-2 text-center text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
      </div>
    {:else}
      <Tabs.Root value="upload" class="w-full">
        <Tabs.List class="grid w-full grid-cols-2">
          <Tabs.Trigger value="upload" class="gap-2">
            <Upload class="h-4 w-4" />
            Upload File
          </Tabs.Trigger>
          <Tabs.Trigger value="url" class="gap-2">
            <Link class="h-4 w-4" />
            Import URL
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="upload" class="mt-4">
          {#if file}
            <div class="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <FileVideo class="h-10 w-10 text-primary" />
              <div class="flex-1">
                <p class="font-medium">{file.name}</p>
                <p class="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <Button variant="ghost" size="icon" onclick={() => (file = null)}>
                <X class="h-4 w-4" />
              </Button>
            </div>
          {:else}
            <!-- Drag & Drop Zone -->
             <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
              class={`relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              ondragover={handleDragOver}
              ondragleave={handleDragLeave}
              ondrop={handleDrop}
              onclick={() => document.getElementById("file-upload")?.click()}
              onkeydown={(e) => e.key === 'Enter' && document.getElementById("file-upload")?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="video/*,audio/*"
                onchange={handleFileChange}
                class="hidden"
              />
              <Upload class="mb-4 h-10 w-10 text-muted-foreground" />
              <p class="mb-1 font-medium">Drag and drop your file here</p>
              <p class="text-sm text-muted-foreground">or click to browse</p>
              <p class="mt-2 text-xs text-muted-foreground">MP4, MOV, MKV, MP3, WAV up to 2GB</p>
            </div>
          {/if}
        </Tabs.Content>

        <Tabs.Content value="url" class="mt-4">
          <div class="space-y-2">
            <Label for="url">Video URL</Label>
            <Input
              id="url"
              placeholder="https://youtube.com/watch?v=..."
              bind:value={url}
            />
            <p class="text-xs text-muted-foreground">Supports YouTube, Vimeo, Loom, and direct video links</p>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div class="space-y-2">
          <Label>Primary Language</Label>
          <Select.Root type="single" bind:value={language}>
            <Select.Trigger>
                {language === 'auto' ? 'Auto-detect' : language}
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="auto">Auto-detect</Select.Item>
                <Select.Item value="en">English</Select.Item>
                <Select.Item value="es">Spanish</Select.Item>
                <Select.Item value="fr">French</Select.Item>
                <Select.Item value="de">German</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <div class="space-y-2">
          <Label>Style Preset</Label>
           <Select.Root type="single" bind:value={preset}>
            <Select.Trigger>
                {preset}
            </Select.Trigger>
            <Select.Content>
                <Select.Item value="youtube">YouTube Educational</Select.Item>
                <Select.Item value="netflix">Netflix Cinematic</Select.Item>
                <Select.Item value="tiktok">TikTok/Reels Viral</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

       <!-- Online/Offline Toggle -->
      <div class="mt-4 flex items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <Label class="text-base">Online Processing (Gemini AI)</Label>
          <p class="text-sm text-muted-foreground">
            {useOnlineMode ? "Uses Cloud AI for best accuracy." : "Uses Local AI (Offline) for privacy."}
          </p>
        </div>
        <Switch bind:checked={useOnlineMode} />
      </div>

      <div class="mt-6 flex justify-end gap-3">
        <Button variant="outline" onclick={() => (open = false)}>
          Cancel
        </Button>
        <Button onclick={handleSubmit} disabled={!file && !url} class="gap-2">
          Start Processing
        </Button>
      </div>
    {/if}
  </Dialog.Content>
</Dialog.Root>
