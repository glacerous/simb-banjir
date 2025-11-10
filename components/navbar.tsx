// components/Navbar.tsx
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Moon, Sun, LogOut } from 'lucide-react'; 
import { useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Peta', href: '/map' },
    { name: 'Persiapan', href: '/education' },
    { name: 'Artikel', href: '/artikel' },
    { name: 'Panduan', href: '/panduan' }
];

export function Navbar() {
    const navRef = useRef<HTMLElement | null>(null);
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    
    // Better Auth session
    const { data: session } = authClient.useSession();
    
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Initialize theme from localStorage/system preference
    useEffect(() => {
        const stored = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let initialTheme: 'light' | 'dark' = 'light';
        if (stored === 'dark' || (stored === null && systemPrefersDark)) {
            initialTheme = 'dark';
        }

        setTheme(initialTheme);
        setInitialized(true);
    }, []);

    // Apply theme class and save to localStorage
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') root.classList.add('dark');
        else root.classList.remove('dark');
        
        if (initialized) {
            localStorage.setItem('theme', theme);
        }
    }, [theme, initialized]);

    // Update nav height CSS variable
    useEffect(() => {
        const updateNavHeight = () => {
          const el = navRef.current;
          if (!el) return;
          const h = el.offsetHeight;
          document.documentElement.style.setProperty('--nav-h', `${h}px`);
        };
        updateNavHeight();
        const ro = new ResizeObserver(updateNavHeight);
        if (navRef.current) ro.observe(navRef.current);
        window.addEventListener('resize', updateNavHeight);
        return () => {
          ro.disconnect();
          window.removeEventListener('resize', updateNavHeight);
        };
    }, []);

    // Check if user is admin
    useEffect(() => {
        let active = true;

        if (!session?.user?.id) {
            setIsAdmin(false);
            return;
        }

        const fetchRole = async () => {
            try {
                const res = await fetch('/api/users/me', { cache: 'no-store' });
                if (!active) return;
                if (res.ok) {
                    const data = await res.json();
                    setIsAdmin(data?.user?.role === 'ADMIN');
                } else {
                    setIsAdmin(false);
                }
            } catch {
                if (active) setIsAdmin(false);
            }
        };

        fetchRole();

        return () => {
            active = false;
        };
    }, [session?.user?.id]);

    const handleThemeToggle = () => {
        setTheme((t) => t === 'dark' ? 'light' : 'dark');
    }

    const handleLogout = async () => {
        await authClient.signOut();
        router.push('/');
        router.refresh();
    }

    return (
        <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 p-4 transition-all duration-300">
            
            <div className="max-w-4xl mx-auto flex justify-between items-center rounded-full px-6 py-2 shadow-xl ring-1 backdrop-blur-md
            bg-white/80 ring-white/50
            dark:bg-gray-900/70 dark:ring-white/10">
                
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2 text-gray-900 dark:text-gray-100 font-semibold font-flink"> 
                    <Home className="w-5 h-5 text-orange-500 fill-orange-500/10"/> 
                    <span></span>
                </Link>
                
                {/* Navigation Links */}
                <div className="hidden md:flex space-x-6 text-sm font-flink font-normal"> 
                    {navItems.map((item) => (
                        <Link 
                            key={item.name} 
                            href={item.href} 
                            className="text-gray-900 hover:text-orange-500 transition-colors dark:text-gray-100"
                        >
                            {item.name}
                        </Link>
                    ))}
                    {isAdmin && (
                        <Link 
                            href="/admin" 
                            className="text-gray-900 hover:text-orange-500 transition-colors dark:text-gray-100"
                        >
                            Admin
                        </Link>
                    )}
                </div>
                
                {/* Login/User Actions */}
                <div className="flex items-center gap-2">
                    {session?.user ? (
                        <>
                            <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {session.user.name || session.user.email}
                            </span>
                            <Button 
                                onClick={handleLogout}
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                aria-label="Logout"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button 
                                className="rounded-full font-flink font-medium 
                                        bg-gray-900 text-white 
                                        hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Toggle theme"
                        onClick={handleThemeToggle}
                        className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        {initialized ? (
                            theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </nav>
    );
}