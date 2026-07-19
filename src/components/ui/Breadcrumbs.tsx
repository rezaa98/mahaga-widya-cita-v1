'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbsProps {
  items: {
    label: string
    href?: string
  }[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-sm text-gray-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
      <Link href="/" className="hover:text-primary-600 transition-colors flex items-center shrink-0">
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
            {isLast || !item.href ? (
              <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary-600 transition-colors shrink-0"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
