import Link from 'next/link';
import { ArrowLeft, Download, FileText, Camera, Globe, Twitter, Mail, ExternalLink, Clock, Hash, Award } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

export default function AbrahamPressKitPage() {
  const pressAssets = [
    {
      title: "High-Resolution Portrait",
      type: "Image",
      format: "PNG, 2400x2400",
      description: "Abraham's primary visual identity",
      downloadUrl: "/press/abraham-portrait-hires.png"
    },
    {
      title: "Logo & Brand Mark",
      type: "Vector",
      format: "SVG, PNG",
      description: "Abraham branding elements",
      downloadUrl: "/press/abraham-logo-pack.zip"
    },
    {
      title: "First Works Samples",
      type: "Gallery",
      format: "JPG, 1200x1200",
      description: "Representative works from 2021 collection",
      downloadUrl: "/press/first-works-samples.zip"
    },
    {
      title: "Covenant Timeline",
      type: "Infographic",
      format: "PNG, PDF",
      description: "13-year journey visualization",
      downloadUrl: "/press/covenant-timeline.pdf"
    }
  ];

  const factSheet = {
    name: "ABRAHAM",
    type: "Autonomous AI Artist",
    created: "Conceived June 2017, First Works Summer 2021",
    creator: "Gene Kogan",
    firstWorks: "2,522 works (Summer 2021)",
    covenantPeriod: "October 19, 2025 - October 19, 2038",
    covenantWorks: "4,748 daily creations (13 years)",
    totalLegacy: "7,270 total works",
    uniqueAspects: [
      "Pre-AI art boom authenticity",
      "Community-generated prompts",
      "13-year autonomous commitment",
      "Daily tournament system",
      "Progressive decentralization"
    ]
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <Link 
            href="/academy/agent/abraham" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {ABRAHAM_BRAND.labels.backToAbraham}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 sm:gap-3 mb-4">
              <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
              <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs border border-purple-400 text-purple-400">
                PRESS KIT
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
              ABRAHAM<br/>PRESS KIT
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8">
              MEDIA RESOURCES • PROVENANCE DOCUMENTATION • VERIFICATION
            </p>
            <p className="text-sm sm:text-base max-w-3xl mx-auto opacity-75">
              Complete media kit for journalists, curators, and collectors covering Abraham's 
              8-year development, First Works authenticity, and 13-year covenant commitment.
            </p>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Quick Facts */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">QUICK FACTS</h2>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Artist Name:</span>
                <span className="font-bold">{factSheet.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Type:</span>
                <span className="font-bold">{factSheet.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Creator:</span>
                <span className="font-bold">{factSheet.creator}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Conceived:</span>
                <span className="font-bold">June 2017</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">First Works:</span>
                <span className="font-bold">{factSheet.firstWorks}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Covenant Period:</span>
                <span className="font-bold text-sm">Oct 2025 - Oct 2038</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Covenant Works:</span>
                <span className="font-bold">{factSheet.covenantWorks}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Total Legacy:</span>
                <span className="font-bold">{factSheet.totalLegacy}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">Art Basel Paris:</span>
                <span className="font-bold">Oct 19-26, 2025</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white">
                <span className="opacity-75">First Works Sale:</span>
                <span className="font-bold">Oct 5, 2025</span>
              </div>
            </div>
          </div>
        </section>

        {/* Download Assets */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">PRESS ASSETS</h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {pressAssets.map((asset, index) => (
              <div key={index} className="border border-white p-4 sm:p-6 hover:bg-white hover:text-black transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold mb-1">{asset.title}</h3>
                    <div className="text-sm opacity-75 mb-2">{asset.type} • {asset.format}</div>
                    <p className="text-sm opacity-75">{asset.description}</p>
                  </div>
                  <FileText className="w-6 h-6 opacity-50" />
                </div>
                <Link
                  href={asset.downloadUrl}
                  className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Provenance Documentation */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">PROVENANCE & VERIFICATION</h2>
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="border border-white p-4 sm:p-6">
              <Hash className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">BLOCKCHAIN RECORD</h3>
              <p className="text-sm leading-relaxed mb-4">
                All Abraham works are recorded on-chain with complete provenance. 
                First Works include original metadata from 2021 creation.
              </p>
              <Link 
                href={ABRAHAM_BRAND.external.abrahamAI}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold hover:underline flex items-center gap-1"
              >
                View Records <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <Clock className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">HISTORICAL TIMELINE</h3>
              <p className="text-sm leading-relaxed mb-4">
                8-year development from conception (2017) to covenant launch (2025). 
                Documented through articles, tweets, and domain registration.
              </p>
              <Link 
                href="/academy/agent/abraham/timeline"
                className="text-sm font-bold hover:underline flex items-center gap-1"
              >
                Full Timeline <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <Award className="w-8 h-8 mb-4" />
              <h3 className="text-xl mb-3">AUTHENTICITY</h3>
              <p className="text-sm leading-relaxed mb-4">
                Pre-AI art boom creation provides unique authenticity. 
                Community involvement and GAN process fully documented.
              </p>
              <Link 
                href="/academy/agent/abraham/first-works-sale"
                className="text-sm font-bold hover:underline flex items-center gap-1"
              >
                Verification <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Key Messages */}
        <section className="border-b border-white pb-12 sm:pb-16">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">KEY MESSAGES</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-purple-400 pl-4 sm:pl-6">
              <h3 className="text-lg font-bold mb-2">Pre-AI Art Boom Authenticity</h3>
              <p className="opacity-75">
                Abraham's First Works were created in Summer 2021, significantly before Art Blocks 
                and the mainstream AI art explosion, representing authentic exploration rather than trend-following.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 pl-4 sm:pl-6">
              <h3 className="text-lg font-bold mb-2">13-Year Autonomous Commitment</h3>
              <p className="opacity-75">
                Abraham's covenant represents the longest autonomous art project ever conceived, 
                with 4,748 daily creations spanning from October 19, 2025 to October 19, 2038.
              </p>
            </div>
            <div className="border-l-4 border-green-400 pl-4 sm:pl-6">
              <h3 className="text-lg font-bold mb-2">Community-Driven Creation</h3>
              <p className="opacity-75">
                Unlike AI art generated in isolation, Abraham's works emerge from community prompts 
                and collaborative feedback, representing true human-AI artistic partnership.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">MEDIA CONTACT</h2>
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h3 className="text-lg font-bold mb-4">ABRAHAM PROJECT</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:abraham@eden.art" className="hover:underline">abraham@eden.art</a>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  <a href="https://twitter.com/abraham_ai" target="_blank" rel="noopener noreferrer" className="hover:underline">@abraham_ai</a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href={ABRAHAM_BRAND.external.abrahamAI} target="_blank" rel="noopener noreferrer" className="hover:underline">abraham.ai</a>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">GENE KOGAN (CREATOR)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:gene@genekogan.com" className="hover:underline">gene@genekogan.com</a>
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  <a href="https://twitter.com/genekogan" target="_blank" rel="noopener noreferrer" className="hover:underline">@genekogan</a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <a href="https://genekogan.com" target="_blank" rel="noopener noreferrer" className="hover:underline">genekogan.com</a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-6 border border-white bg-gray-900/20">
            <p className="text-sm opacity-75 text-center">
              For high-resolution images, interview requests, or additional information, 
              please contact the Abraham project team. Response within 24 hours guaranteed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Abraham Press Kit - Media Resources & Provenance Documentation',
  description: 'Complete press kit for Abraham, including media assets, provenance documentation, and verification of the 8-year AI art project.',
};