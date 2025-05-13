import React from 'react';
import { Link, useLocation } from 'wouter';
import Logo from '@/components/Logo';
import ShieldButton from '@/components/ShieldButton';
import { useAuth } from "@/hooks/use-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideIcon } from "lucide-react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { CaretDownIcon } from "@radix-ui/react-icons"

import {
  BadgeCheck,
  LogOut,
  PaintbrushIcon,
  Box,
  ImageIcon,
  WalletCards,
  User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  onMenuOpen: () => void;
}
type ListItemProps = {
  title: string
  href: string
  icon?: LucideIcon
  iconClassName?: string
}

const Header: React.FC<HeaderProps> = ({ onMenuOpen }) => {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const ListItem = ({ title, href, icon: Icon, iconClassName }: ListItemProps) => (
    <li>
      <NavigationMenu.Link asChild>
        <a
          className="flex items-center gap-3 rounded px-4 py-2 text-white transition-colors hover:bg-[rgba(255,215,0,0.08)]"
          href={href}
        >
          {Icon ? (
            <Icon className="h-4 w-4 text-[--gold-default]" />
          ) : iconClassName ? (
            <i className={`${iconClassName} text-[--gold-default] text-lg`} />
          ) : null}
          <span className="hover:text-[--gold-default]">{title}</span>
        </a>
      </NavigationMenu.Link>
    </li>
  );

  return (
    <header className="border-b border-[--gold-default]/30 sticky top-0 z-50 bg-[--navy-default]/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between w-full">
          <Logo />

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[--gold-default] text-xl">
              <i className="ri-menu-line" />
            </button>
          </div>

          <NavigationMenu.Root className="hidden md:flex justify-center font-cinzel text-sm">
            <NavigationMenu.List className="flex gap-6 text-white">
              {user ? (<>
                <NavigationMenu.Item>
                  <NavigationMenu.Trigger className="group flex items-center gap-1 px-1.5 py-0 text-white hover:text-[--gold-default] data-[state=open]:text-[--gold-default]">
                    Workspace
                    <CaretDownIcon className="transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="absolute mt-2 w-60 rounded-md border border-[--gold-default]/20 bg-[--navy-default] p-2 text-white shadow-lg z-50">
                    <ul className="flex flex-col gap-1">
                      <ListItem href="/create" title="Text to 3D" icon={Box} />
                      <ListItem href="/image-to-model" title="Image to 3D" icon={ImageIcon} />
                      {/* <ListItem href="/create" title="AI Texturing" icon={PaintbrushIcon} /> */}
                    </ul>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item><NavigationMenu.Link href="/dashboard" className="hover:text-[--gold-default]">Dashboard</NavigationMenu.Link></NavigationMenu.Item>
              </>
              ) : (<NavigationMenu.Item><NavigationMenu.Link href="/" className="hover:text-[--gold-default]">Home</NavigationMenu.Link></NavigationMenu.Item>
              )}

              <NavigationMenu.Item><NavigationMenu.Link href="/community" className="hover:text-[--gold-default]">Community</NavigationMenu.Link></NavigationMenu.Item>
              <NavigationMenu.Item><NavigationMenu.Link href="/pricing" className="hover:text-[--gold-default]">Pricing</NavigationMenu.Link></NavigationMenu.Item>
              <NavigationMenu.Item><NavigationMenu.Link  className="hover:text-[--gold-default]">Learn</NavigationMenu.Link></NavigationMenu.Item>
            </NavigationMenu.List>
          </NavigationMenu.Root>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/inbox" className="text-[--gold-default] text-xl"><i className="ri-message-3-line" /></Link>
                <i className="ri-notification-3-line text-xl text-[--gold-default]" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="/assets/MakerGrid_Blue_Background.jpg" alt={user.username} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-56 mr-2" side="bottom" align="start" sideOffset={10}>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-2 py-2">
                        <Avatar className="h-8 w-8 rounded-full">
                          <AvatarImage src="/assets/MakerGrid_Blue_Background.jpg" alt={user.username} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-semibold truncate">{user.username}</p>
                          <p className="text-xs truncate text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setLocation(`/account/profile/${user.username}`)}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setLocation(`/account/assets`)}><BadgeCheck className="mr-2 h-4 w-4" />My Assets</DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => setLocation(`/account/billing`)}><WalletCards className="mr-2 h-4 w-4" />Billing</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 hover:bg-red-100" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/register">
                <ShieldButton variant="secondary">Sign Up - It's Free</ShieldButton>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[--navy-default] px-4 py-4 space-y-4 transition-all">
            <ul className="space-y-2 text-white">
              {user ? (
                <>
                  <li><Link href="/dashboard"><a onClick={() => setMobileMenuOpen(false)}>Dashboard</a></Link></li>
                  <li><Link href="/community"><a onClick={() => setMobileMenuOpen(false)}>Community</a></Link></li>
                  <li><Link href="/pricing"><a onClick={() => setMobileMenuOpen(false)}>Pricing</a></Link></li>
                  <li><Link href="/learn"><a onClick={() => setMobileMenuOpen(false)}>Learn</a></Link></li>
                  <li><Link href="/create"><a onClick={() => setMobileMenuOpen(false)}>Text to 3D</a></Link></li>
                  <li><Link href="/image-to-model"><a onClick={() => setMobileMenuOpen(false)}>Image to 3D</a></Link></li>
                  <li><Link href="/features/ai"><a onClick={() => setMobileMenuOpen(false)}>AI-Driven 3D</a></Link></li>
                  <li><Link href={`/profile/${user.username}`}><a onClick={() => setMobileMenuOpen(false)}>Profile</a></Link></li>
                </>
              ) : (
                <>
                  <li><Link href="/"><a onClick={() => setMobileMenuOpen(false)}>Home</a></Link></li>
                  <li><Link href="/community"><a onClick={() => setMobileMenuOpen(false)}>Community</a></Link></li>
                  <li><Link href="/pricing"><a onClick={() => setMobileMenuOpen(false)}>Pricing</a></Link></li>
                  <li><Link href="/learn"><a onClick={() => setMobileMenuOpen(false)}>Learn</a></Link></li>
                  <li><Link href="/register"><a onClick={() => setMobileMenuOpen(false)}>Sign Up - It's Free</a></Link></li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;