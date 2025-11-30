"use client";

import { useState } from "react";
import { BadgeCard } from "@/components/BadgeCard";
import { BadgeModal } from "@/components/BadgeModal";
import { Badge } from "@/types/badge";

export interface BadgeListItem {
    badge: Badge;
    isUnlocked: boolean;
}

interface BadgeListProps {
    badges: BadgeListItem[];
}

export function BadgeList({ badges }: BadgeListProps) {
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBadgeClick = (badge: Badge) => {
        setSelectedBadge(badge);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-3 gap-4">
                {badges.map((item, index) => (
                    <BadgeCard 
                        key={item.badge.id || index} 
                        badge={item.badge} 
                        isUnlocked={item.isUnlocked} 
                        onClick={() => item.isUnlocked && handleBadgeClick(item.badge)} 
                    />
                ))}
            </div>

            <BadgeModal 
                badge={selectedBadge} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}
