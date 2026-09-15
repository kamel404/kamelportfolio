"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { Section } from "@/components/ui/Section";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mouse drag-to-scroll support state
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const isDragging = useRef(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "All") return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);

    const hasMore = maxScroll > 8;
    setHasOverflow(hasMore);

    if (!hasMore) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const cards = el.querySelectorAll("article");
    const containerRect = el.getBoundingClientRect();

    let atStart = scrollLeft <= 4;
    let atEnd = scrollLeft >= maxScroll - 4;

    if (cards.length > 0) {
      const firstCard = cards[0];
      const lastCard = cards[cards.length - 1];

      if (firstCard) {
        const firstRect = firstCard.getBoundingClientRect();
        if (firstRect.left >= containerRect.left - 4) {
          atStart = true;
        }
      }

      if (lastCard) {
        const lastRect = lastCard.getBoundingClientRect();
        if (lastRect.right <= containerRect.right + 4) {
          atEnd = true;
        }
      }
    }

    setCanScrollLeft(!atStart);
    setCanScrollRight(!atEnd);

    // Determine currently centered/active card
    const cardEl = cards[0];
    const cardWidth = cardEl ? cardEl.getBoundingClientRect().width : 360;
    const step = cardWidth + 20;
    const index = Math.round(scrollLeft / step);
    setActiveIndex(Math.max(0, Math.min(filteredProjects.length - 1, index)));
  }, [filteredProjects.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    const timer = setTimeout(checkScroll, 100);

    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        checkScroll();
      });
      ro.observe(el);
    }

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      if (ro) ro.disconnect();
    };
  }, [checkScroll, filteredProjects]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardEl = el.querySelector("article");
    const cardWidth = cardEl ? cardEl.getBoundingClientRect().width : 360;
    const step = cardWidth + 20;

    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });

    const delays = [60, 150, 300, 450, 600];
    delays.forEach((delay) => setTimeout(checkScroll, delay));
  };

  const scrollToProject = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("article");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
      const delays = [60, 150, 300, 450, 600];
      delays.forEach((delay) => setTimeout(checkScroll, delay));
    }
  };

  // Drag-to-scroll handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current || e.button !== 0) return;
    isMouseDown.current = true;
    isDragging.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const distance = x - startX.current;
    if (Math.abs(distance) > 6) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      scrollRef.current.scrollLeft = scrollLeftStart.current - distance;
      checkScroll();
    }
  };

  const onMouseUp = () => {
    isMouseDown.current = false;
    setTimeout(() => {
      isDragging.current = false;
    }, 50);
    checkScroll();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <Section
      id="projects"
      title="Featured Projects"
      subtitle="A curated selection of software applications, demonstrating full-stack engineering, API design, and practical solutions."
    >
      {/* Category Filters */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#D97757] text-white shadow-xs"
                  : "bg-white text-[#6B6A63] border border-[#E4E1D8] hover:text-[#1F1F1C] hover:bg-[#EDE8DE]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Carousel Container with Left & Right Side Arrows */}
      <div className="relative">
        {/* Left Arrow Button */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Previous project"
            className={`absolute left-1 sm:-left-5 lg:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border flex items-center justify-center transition-all duration-200 ${
              canScrollLeft
                ? "opacity-100 scale-100 cursor-pointer pointer-events-auto text-[#1F1F1C] border-[#E4E1D8] shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:text-[#D97757] hover:border-[#D97757]/50 hover:shadow-[0_4px_20px_rgba(217,119,87,0.25)] hover:scale-110 active:scale-95"
                : "opacity-0 scale-90 pointer-events-none cursor-default shadow-none border-transparent invisible"
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Right Arrow Button */}
        {hasOverflow && (
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Next project"
            className={`absolute right-1 sm:-right-5 lg:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border flex items-center justify-center transition-all duration-200 ${
              canScrollRight
                ? "opacity-100 scale-100 cursor-pointer pointer-events-auto text-[#1F1F1C] border-[#E4E1D8] shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:text-[#D97757] hover:border-[#D97757]/50 hover:shadow-[0_4px_20px_rgba(217,119,87,0.25)] hover:scale-110 active:scale-95"
                : "opacity-0 scale-90 pointer-events-none cursor-default shadow-none border-transparent invisible"
            }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Outer Wrapper for bleeding / padding */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8">
          {/* Left Fade Mask */}
          <div
            aria-hidden="true"
            className={`absolute left-0 top-0 bottom-4 w-10 sm:w-16 bg-gradient-to-r from-[#F7F6F2] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Horizontal Scroll Track */}
          <div
            ref={scrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onClickCapture={handleClickCapture}
            className="flex gap-5 overflow-x-auto pb-5 pt-2 px-4 sm:px-6 lg:px-8 items-start snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing select-none"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                className="w-[82vw] max-w-[340px] sm:w-[360px] md:w-[380px] shrink-0 snap-start h-[480px]"
              />
            ))}
          </div>

          {/* Right Fade Mask */}
          <div
            aria-hidden="true"
            className={`absolute right-0 top-0 bottom-4 w-10 sm:w-16 bg-gradient-to-l from-[#F7F6F2] to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {/* Dot Navigation Indicators */}
      {hasOverflow && filteredProjects.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {filteredProjects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => scrollToProject(idx)}
              aria-label={`Go to project ${idx + 1}`}
              className={`rounded-full transition-all duration-300 ease-out cursor-pointer ${
                activeIndex === idx
                  ? "w-8 h-2.5 bg-[#D97757] shadow-[0_0_8px_rgba(217,119,87,0.5)]"
                  : "w-2.5 h-2.5 bg-[#E4E1D8] hover:bg-[#D97757]/40 hover:scale-110"
              }`}
            />
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 text-[#6B6A63] text-sm">
          No projects found in this category.
        </div>
      )}
    </Section>
  );
}
