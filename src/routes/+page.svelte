<script lang="ts">
  import { Sparkles, ArrowRight, Play, Zap, Wand2, Languages, Palette, TrendingUp, Mic, Scissors, CheckCircle2, Globe, Users, Download, Clock } from "lucide-svelte";
</script>

<div class="min-h-screen bg-[#090b0f] text-white">
  <!-- Navigation -->
  <header class="sticky top-0 z-50 border-b border-white/10 bg-[#090b0f]/95 backdrop-blur-xl">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#1a365d] to-[#1a365d]/50">
          <Sparkles class="h-5 w-5 text-[#d69e2e]" />
          <span class="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            SubGEN PRO
          </span>
        </div>
      </div>
      <nav class="hidden items-center gap-6 md:flex">
        <a href="#features" class="text-sm text-white/60 hover:text-white transition-colors">Features</a>
        <a href="#ai-features" class="text-sm text-white/60 hover:text-white transition-colors">AI Powers</a>
        <a href="#pricing" class="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
      </nav>
      <div class="flex items-center gap-3">
        <a href="/dashboard">
            <button class="px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-md">
                Sign In
            </button>
        </a>
        <a href="/dashboard">
          <button class="px-3 py-2 text-sm font-bold bg-gradient-to-r from-[#d69e2e] to-[#d69e2e]/80 text-black rounded-md hover:from-[#d69e2e]/90 hover:to-[#d69e2e]/70">
            Get Started Free
          </button>
        </a>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative container mx-auto px-4 py-24 text-center overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-b from-[#1a365d]/20 via-transparent to-transparent pointer-events-none"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d69e2e]/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="relative mx-auto max-w-4xl">
      <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d69e2e]/30 bg-[#d69e2e]/10 px-4 py-2 text-sm">
        <Sparkles class="h-4 w-4 text-[#d69e2e]" />
        <span class="text-[#d69e2e]">Powered by Gemini 2.5 Flash AI</span>
      </div>
      <h1 class="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
        <span class="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          AI Subtitles That
        </span>
        <br />
        <span class="bg-gradient-to-r from-[#d69e2e] to-[#d69e2e]/60 bg-clip-text text-transparent">
          Think Like an Editor
        </span>
      </h1>
      <p class="mx-auto mb-10 max-w-2xl text-lg text-white/60">
        Transform raw transcripts into publish-ready subtitles in minutes.
        Multi-speaker detection, 100+ languages, and intelligent refinement
        that saves you hours of manual editing.
      </p>
      <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="/dashboard">
          <button class="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-gradient-to-r from-[#d69e2e] to-[#d69e2e]/80 text-black rounded-md hover:from-[#d69e2e]/90 hover:to-[#d69e2e]/70">
            Start Free <ArrowRight class="h-4 w-4" />
          </button>
        </a>
        <button class="flex items-center gap-2 px-8 py-3 text-lg font-semibold bg-transparent border border-white/20 text-white rounded-md hover:bg-white/10">
          <Play class="h-4 w-4" /> Watch Demo
        </button>
      </div>
      <p class="mt-6 text-sm text-white/40">
        No credit card required. 3 free videos per month.
      </p>
    </div>

    <!-- Hero Stats -->
    <div class="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
      <div class="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div class="text-4xl font-bold text-[#d69e2e]">98%</div>
        <div class="text-sm text-white/60">Transcription Accuracy</div>
      </div>
      <div class="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div class="text-4xl font-bold text-[#d69e2e]">100+</div>
        <div class="text-sm text-white/60">Languages Supported</div>
      </div>
      <div class="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <div class="text-4xl font-bold text-[#d69e2e]">90%</div>
        <div class="text-sm text-white/60">Time Saved vs Manual</div>
      </div>
    </div>
  </section>

  <!-- AI Features Section -->
  <section id="ai-features" class="py-24 border-t border-white/10 bg-gradient-to-b from-[#0d1117] to-[#090b0f]">
    <div class="container mx-auto px-4">
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1a365d]/50 bg-[#1a365d]/20 px-4 py-2 text-sm text-white/80">
          <Zap class="h-4 w-4 text-[#d69e2e]" />
          LLM-Powered Features
        </div>
        <h2 class="mb-4 text-4xl font-bold text-white">
          The AI Brain Behind SubGEN PRO
        </h2>
        <p class="text-white/60">
          Harness the power of Gemini to transform your subtitle workflow.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each [
          { icon: Wand2, title: "AI Semantic Refiner", desc: "Analyzes the entire subtitle track to fix punctuation, capitalization, and awkward phrasing." },
          { icon: Languages, title: "AI Global Translator", desc: "Context-aware translation to convert your subtitles into any target language without losing the soul." },
          { icon: Palette, title: "AI Tone Shifter", desc: "Rewrites your dialogue to match a specific vibe, such as Formal, Hype/Viral, or Cinematic." },
          { icon: TrendingUp, title: "AI Marketing Hooks", desc: "Scans the transcript to generate viral-ready summaries, hooks, and hashtags." },
          { icon: Mic, title: "AI Voice Refinement", desc: "Cleans up your spoken words into polished, broadcast-ready subtitles as you record." },
          { icon: Scissors, title: "Smart Timeline Editor", desc: "Professional-grade timeline with zoom, split tools, draggable pills, and precise timing controls." }
        ] as feature}
          <div class="border border-white/10 bg-gradient-to-br from-[#1a365d]/20 to-[#090b0f] backdrop-blur-sm hover:border-[#d69e2e]/30 transition-all group rounded-lg p-6">
              <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#d69e2e]/10 group-hover:bg-[#d69e2e]/20 transition-colors">
                <feature.icon class="h-6 w-6 text-[#d69e2e]" />
              </div>
              <h3 class="mb-2 text-lg font-semibold text-white">✨ {feature.title}</h3>
              <p class="text-sm text-white/60">{feature.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="border-t border-white/10 bg-[#090b0f] py-24">
    <div class="container mx-auto px-4">
      <div class="mx-auto mb-16 max-w-2xl text-center">
        <h2 class="mb-4 text-4xl font-bold text-white">
          Everything You Need for Perfect Subtitles
        </h2>
        <p class="text-white/60">
          From transcription to localization, all powered by advanced AI.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each [
           { icon: Zap, title: "Lightning Fast", desc: "Transcribe hours of video in minutes with Gemini 2.5 Flash." },
           { icon: Users, title: "Multi-Speaker Detection", desc: "Automatically detect and label up to 10 speakers with 95%+ accuracy." },
           { icon: Globe, title: "True Localization", desc: "Translate to 100+ languages with cultural adaptation." },
           { icon: Download, title: "Flexible Export", desc: "Export to SRT, VTT, ASS, and more. Burn subtitles into video." },
           { icon: Clock, title: "Highlight Detection", desc: "Automatically find viral moments in long videos." },
           { icon: Wand2, title: "AI Refinement", desc: "Context-aware editing that fixes grammar and removes fillers." }
        ] as feature}
          <div class="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-6">
            <div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#1a365d]/30">
              <feature.icon class="h-6 w-6 text-[#d69e2e]" />
            </div>
            <h3 class="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
            <p class="text-sm text-white/60">{feature.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Pricing Section -->
  <section id="pricing" class="border-t border-white/10 bg-gradient-to-b from-[#0d1117] to-[#090b0f] py-24">
    <div class="container mx-auto px-4">
        <div class="mx-auto mb-16 max-w-2xl text-center">
            <h2 class="mb-4 text-4xl font-bold text-white">Simple, Transparent Pricing</h2>
            <p class="text-white/60">Start free, upgrade when you need more.</p>
        </div>
        <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <!-- Free Plan -->
            <div class="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 class="mb-2 text-lg font-semibold text-white">Free</h3>
                <div class="mb-4">
                    <span class="text-4xl font-bold text-white">$0</span>
                    <span class="text-white/60">/month</span>
                </div>
                <ul class="mb-6 space-y-3 text-sm">
                    {#each ["3 videos/month", "Up to 30 min each", "1 language", "Standard presets"] as item}
                        <li class="flex items-center gap-2 text-white/80">
                            <CheckCircle2 class="h-4 w-4 text-[#d69e2e]" /> {item}
                        </li>
                    {/each}
                </ul>
                <a href="/dashboard" class="block">
                    <button class="w-full py-2 bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-md font-medium">Get Started</button>
                </a>
            </div>

             <!-- Creator Plan -->
             <div class="border border-[#d69e2e]/50 bg-gradient-to-br from-[#1a365d]/30 to-[#090b0f] relative rounded-lg p-6 pt-8">
                <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span class="rounded-full bg-gradient-to-r from-[#d69e2e] to-[#d69e2e]/80 px-4 py-1 text-xs font-semibold text-black">
                        Popular
                    </span>
                </div>
                <h3 class="mb-2 text-lg font-semibold text-white">Creator</h3>
                <div class="mb-4">
                    <span class="text-4xl font-bold text-[#d69e2e]">$9</span>
                    <span class="text-white/60">/month</span>
                </div>
                <ul class="mb-6 space-y-3 text-sm">
                    {#each ["20 videos/month", "Up to 2 hours each", "Unlimited languages", "All AI features", "Priority support"] as item}
                        <li class="flex items-center gap-2 text-white/80">
                            <CheckCircle2 class="h-4 w-4 text-[#d69e2e]" /> {item}
                        </li>
                    {/each}
                </ul>
                <a href="/dashboard" class="block">
                    <button class="w-full py-2 bg-gradient-to-r from-[#d69e2e] to-[#d69e2e]/80 text-black font-semibold hover:from-[#d69e2e]/90 hover:to-[#d69e2e]/70 rounded-md">Start Free Trial</button>
                </a>
            </div>

            <!-- Pro Plan -->
             <div class="border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 class="mb-2 text-lg font-semibold text-white">Pro</h3>
                <div class="mb-4">
                    <span class="text-4xl font-bold text-white">$29</span>
                    <span class="text-white/60">/month</span>
                </div>
                <ul class="mb-6 space-y-3 text-sm">
                    {#each ["100 videos/month", "Up to 10 hours each", "Priority processing", "Team collaboration", "API access"] as item}
                        <li class="flex items-center gap-2 text-white/80">
                            <CheckCircle2 class="h-4 w-4 text-[#d69e2e]" /> {item}
                        </li>
                    {/each}
                </ul>
                <a href="/dashboard" class="block">
                    <button class="w-full py-2 bg-transparent border border-white/20 text-white hover:bg-white/10 rounded-md font-medium">Start Free Trial</button>
                </a>
            </div>
        </div>
    </div>
  </section>

   <!-- Footer -->
   <footer class="border-t border-white/10 py-8 bg-[#0d1117]">
    <div class="container mx-auto flex flex-col items-center justify-between gap-4 px-4 sm:flex-row">
      <div class="flex items-center gap-2">
        <Sparkles class="h-5 w-5 text-[#d69e2e]" />
        <span class="font-semibold text-white">SubGEN PRO</span>
      </div>
      <p class="text-sm text-white/40">
        © 2025 SubGEN PRO. All rights reserved.
      </p>
    </div>
  </footer>
</div>
