
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ArrowRight, CheckCircle, Shield, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <section className="py-20 bg-gradient-to-b from-zenith-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">About PDF Zenith</h1>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto">
            We're on a mission to make working with PDFs easy and accessible for everyone.
          </p>
        </div>
      </section>
      
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-zinc-600 mb-4">
                PDF Zenith started with a simple idea: PDF tools should be intuitive, accessible, and free for everyone. 
                We were tired of complicated software and expensive subscriptions just to perform basic PDF operations.
              </p>
              <p className="text-zinc-600 mb-4">
                Founded in 2023, our team of developers and designers works tirelessly to create the best PDF conversion and editing tools available online.
              </p>
              <p className="text-zinc-600">
                Today, PDF Zenith serves millions of users worldwide, helping them convert, edit, merge, and manage their PDF documents with ease.
              </p>
            </div>
            
            <div className="bg-zenith-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Key Facts</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-zenith-500 mt-1">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Millions of Happy Users</h4>
                    <p className="text-zinc-500 text-sm">
                      Trusted by individuals and businesses worldwide.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-zenith-500 mt-1">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">High-Quality Conversions</h4>
                    <p className="text-zinc-500 text-sm">
                      Our advanced algorithms ensure the best possible output quality.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-zenith-500 mt-1">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">100% Secure</h4>
                    <p className="text-zinc-500 text-sm">
                      Files are encrypted in transit and automatically deleted after processing.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="text-zenith-500 mt-1">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Fast Processing</h4>
                    <p className="text-zinc-500 text-sm">
                      Most conversions complete in seconds, saving you valuable time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Core Values</h2>
            <p className="text-zinc-600 max-w-3xl mx-auto">
              These principles guide everything we do at PDF Zenith.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-white to-zenith-50 p-8 rounded-xl border border-zinc-100 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-zenith-100 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-zenith-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Simplicity First</h3>
              <p className="text-zinc-600">
                We believe that powerful tools don't need to be complicated. 
                Our interface is designed to be intuitive and easy to use.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-zenith-50 p-8 rounded-xl border border-zinc-100 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-zenith-100 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-zenith-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Free for Everyone</h3>
              <p className="text-zinc-600">
                We believe that essential PDF tools should be accessible to everyone, 
                regardless of their financial situation.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-zenith-50 p-8 rounded-xl border border-zinc-100 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-zenith-100 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-zenith-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Privacy Focused</h3>
              <p className="text-zinc-600">
                Your files and data belong to you. We implement strong security measures 
                and never store your files longer than necessary.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-zenith-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Converting?</h2>
          <p className="text-xl text-zinc-600 max-w-3xl mx-auto mb-8">
            Experience the easiest way to work with PDF files online, completely free.
          </p>
          <Button size="lg" className="bg-zenith-500 hover:bg-zenith-600 text-white">
            Try PDF Zenith Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
