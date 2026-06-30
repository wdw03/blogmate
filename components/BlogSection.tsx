
import React from 'react';
import { BLOG_POSTS } from '../constants';
import { ArrowRight, Calendar, User } from 'lucide-react';

const BlogSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Intelligence & Insights</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Stay ahead of the curve with our expert analysis on domain trends, SEO strategies, and marketplace security.
            </p>
          </div>
          <a 
            href="#/blog" 
            className="inline-flex items-center px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            Explore the Blog
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.id} 
              className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all group"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {post.category}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center space-x-4 text-slate-400 dark:text-slate-500 text-xs mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto">
                  <a 
                    href={`#/post/${post.id}`} 
                    className="inline-flex items-center font-bold text-slate-900 group/link"
                  >
                    <span>Read Article</span>
                    <div className="ml-2 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
