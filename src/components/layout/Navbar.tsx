'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './Toogler';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  className?: string;
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
    className?: string;
  };
  menu?: MenuItem[];
}

export const Navbar = ({
  logo = {
    url: '/',
    src: '/food2.png',
    alt: 'logo',
    title: 'UrbanEats',
  },
  menu = [
    { title: 'Home', url: '/' },
    { title: 'Meals', url: '/meals' },
    { title: 'Dashboard', url: '/dashboard' },
  ],
  className,
}: NavbarProps) => {
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Fetch session on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/me', {
          credentials: 'include',
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.data || data);
      } catch (err) {
        setUser(null);
        console.error(err);
      }
    };

    fetchUser();
  }, []);


  const handleSignOut = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to sign out');
      setUser(null);
     
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className={cn('py-4', className)}>
      <div className="container mx-auto px-5">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center justify-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
              <span className="text-lg font-semibold tracking-tighter text-emerald-600 dark:text-emerald-400">
                {logo.title}
              </span>
            </Link>

            <NavigationMenu>
              <NavigationMenuList>
                {menu.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.url}
                        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
                      >
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-2 items-center">
            <ModeToggle />
            {!user ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <Button variant="destructive" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <Link href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>

              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 p-4">
                  <Accordion type="single" collapsible className="flex w-full flex-col gap-4">
                    {menu.map((item) =>
                      item.items ? (
                        <AccordionItem key={item.title} value={item.title} className="border-b-0">
                          <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">{item.title}</AccordionTrigger>
                          <AccordionContent className="mt-2">
                            {item.items.map((subItem) => (
                              <a
                                key={subItem.title}
                                href={subItem.url}
                                className="flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none hover:bg-muted hover:text-accent-foreground"
                              >
                                {subItem.icon && <div>{subItem.icon}</div>}
                                <div>
                                  <div className="text-sm font-semibold">{subItem.title}</div>
                                  {subItem.description && <p className="text-sm text-muted-foreground">{subItem.description}</p>}
                                </div>
                              </a>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <a key={item.title} href={item.url} className="text-md font-semibold">
                          {item.title}
                        </a>
                      )
                    )}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <ModeToggle />
                    {!user ? (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      </>
                    ) : (
                      <Button variant="destructive" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};
