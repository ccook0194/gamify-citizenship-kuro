'use client';

import React, { useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import ExpandableChat from './ExpandableChat';
import KuroStatus from '@/components/KuroStatus';
import { Music2, Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSun,
  CloudDrizzle,
  Users,
  Clock,
  Coffee,
  TreesIcon as Tree,
  Building2,
  Mail,
  Home,
  Newspaper,
  ShoppingCart,
  Shirt,
  Moon,
  Sunrise,
} from 'lucide-react';
import CharacterStatsDialog from './CharacterStatsDialog';
import AIAgentDialog from './AIAgentDialog';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ApplicationProcessModal from './modals/ApplicationProcessModal';
import Image from 'next/image';
import ImagesLinks from '@/utils/ImagesLinks';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Alert } from './ui/alert';
import MotionAlert from './MotionAlert';
import { debounce } from 'lodash';

// Custom scrollbar styling
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #ffecec;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #ff5a78;
    border-radius: 3px;
  }
`;

// Animation variants for UI elements
const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      duration: 0.3,
      bounce: 0,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -4 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      duration: 0.3,
      bounce: 0,
    },
  },
  exit: {
    opacity: 0,
    x: 4,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const popoverVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 4 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      duration: 0.25,
      bounce: 0,
    },
  },
};

// Define MovingClouds so they animate over the map.
// You can adjust the duration, delay, and z-index as needed.
const MovingClouds = () => {
  const clouds = [
    { src: '/mapLayers/movingCloud1.png', top: '5%', duration: 90, delay: 0 },
    { src: '/mapLayers/movingCloud2.png', top: '10%', duration: 110, delay: 20 },
    { src: '/mapLayers/movingCloud3.png', top: '3%', duration: 80, delay: 10 },
    { src: '/mapLayers/movingCloud4.png', top: '8%', duration: 100, delay: 30 },
  ];
  return (
    <>
      {clouds.map((cloud, index) => (
        <img
          key={index}
          src={cloud.src}
          alt="Moving Cloud"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          style={{
            position: 'absolute',
            top: cloud.top,
            left: '-30%',
            width: '300px',
            opacity: 0.8,
            pointerEvents: 'none',
            // Place moving clouds above the panned layers but below UI overlays:
            zIndex: 100,
            animation: `moveCloud${index} ${cloud.duration}s linear infinite`,
            animationDelay: `${cloud.delay}s`,
          }}
        />
      ))}
      <style jsx global>{`
        @keyframes moveCloud0 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(160vw);
          }
        }
        @keyframes moveCloud1 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(160vw);
          }
        }
        @keyframes moveCloud2 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(160vw);
          }
        }
        @keyframes moveCloud3 {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(160vw);
          }
        }
      `}</style>
    </>
  );
};

interface Location {
  id: number;
  name: string;
  // Coordinates in percentage relative to 1920x1080
  x: number;
  y: number;
  icon: JSX.Element;
  color: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: 'Coffee Shop',
    x: 81.35,
    y: 47.9,
    icon: <Coffee className="w-4 h-4" />,
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 2,
    name: 'Park',
    x: 48.44,
    y: 48.98,
    icon: <Tree className="w-4 h-4" />,
    color: 'from-green-400 to-green-600',
  },
  {
    id: 3,
    name: 'Office Building',
    x: 23.57,
    y: 34.81,
    icon: <Building2 className="w-4 h-4" />,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 4,
    name: 'Town Hall',
    x: 79.79,
    y: 76.2,
    icon: <Image src={ImagesLinks.mayor} alt="Town Hall" width={48} height={48} />,
    color: 'from-red-400 to-red-600',
  },
  {
    id: 5,
    name: "Kuro's House",
    x: 48.75,
    y: 87.59,
    icon: <Home className="w-4 h-4" />,
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 6,
    name: 'Newspaper Stand',
    x: 27.86,
    y: 73.47,
    icon: <Newspaper className="w-4 h-4" />,
    color: 'from-orange-400 to-orange-600',
  },
  {
    id: 7,
    name: 'Grocery Store',
    x: 52.5,
    y: 17.13,
    icon: <ShoppingCart className="w-4 h-4" />,
    color: 'from-lime-400 to-lime-600',
  },
  {
    id: 8,
    name: 'Fashion Store',
    x: 67.02,
    y: 34.91,
    icon: <Shirt className="w-4 h-4" />,
    color: 'from-pink-400 to-pink-600',
  },
];

const aiAgents = [
  {
    id: 1,
    name: 'Kuro',
    location: "Kuro's House",
    avatar: '/pfps/pfp1.png',
    color: 'bg-amber-600',
    isMainAgent: true,
  },
  {
    id: 2,
    name: 'Theo',
    location: 'Grocery Store',
    avatar: '/pfps/pfp2.png',
    color: 'bg-amber-600',
    isMainAgent: true,
  },
  {
    id: 3,
    name: 'Milo',
    location: 'Coffee Shop',
    avatar: '/pfps/pfp3.png',
    color: 'bg-amber-600',
    isMainAgent: true,
  },
  {
    id: 4,
    name: 'Alice',
    location: 'Coffee Shop',
    avatar: '/pfps/pfp6.png',
    color: 'bg-amber-600',
    isMainAgent: false,
  },
  { id: 5, name: 'Bob', location: 'Park', avatar: '', color: 'bg-green-600', isMainAgent: false },
  {
    id: 6,
    name: 'Klaus',
    location: 'Office Building',
    avatar: '/pfps/pfp4.png',
    color: 'bg-blue-600',
    isMainAgent: false,
  },
  {
    id: 7,
    name: 'Diana',
    location: 'Town Hall',
    avatar: '',
    color: 'bg-red-600',
    isMainAgent: false,
  },
  {
    id: 8,
    name: 'Ethan',
    location: 'Newspaper Stand',
    avatar: '',
    color: 'bg-orange-600',
    isMainAgent: false,
  },
  {
    id: 9,
    name: 'Ava',
    location: 'Grocery Store',
    avatar: '/pfps/pfp5.png',
    color: 'bg-lime-600',
    isMainAgent: false,
  },
  {
    id: 10,
    name: 'George',
    location: 'Fashion Store',
    avatar: '',
    color: 'bg-pink-600',
    isMainAgent: false,
  },
];

// Mapping for structures (hover effect controlled via buttons)
const structureMapping: Record<string, string> = {
  _0007_house7: 'Coffee Shop',
  _0002_fountain: 'Park',
  _0000_house1: "Kuro's House",
  _0011_house10: 'Grocery Store',
  _0004_house2: 'Town Hall',
  _0008_house8: 'Fashion Store',
  _0009_house9: 'Office Building',
  _0005_house4: 'Newspaper Stand',
};

// Layers to be panned (exclude base clouds)
const pannedLayers = [
  { name: '_0013_street', width: 1920, height: 1080, top: 0, left: 0 },
  { name: '_0012_trees4', width: 804, height: 269, top: 0, left: 534 },
  { name: '_0011_house10', width: 516, height: 360, top: 5, left: 750 },
  { name: '_0010_trees3', width: 746, height: 798, top: 199, left: 645 },
  { name: '_0009_house9', width: 905, height: 518, top: 117, left: 0 },
  { name: '_0008_house8', width: 682, height: 434, top: 160, left: 945 },
  { name: '_0007_house7', width: 548, height: 296, top: 369, left: 1288 },
  { name: '_0006_trees2', width: 282, height: 243, top: 530, left: 1638 },
  { name: '_0005_house4', width: 1068, height: 573, top: 507, left: 1 },
  { name: '_0004_house2', width: 610, height: 442, top: 602, left: 1227 },
  { name: '_0003_lamps', width: 821, height: 556, top: 129, left: 418 },
  { name: '_0002_fountain', width: 158, height: 194, top: 432, left: 851 },
  { name: '_0001_trees1', width: 204, height: 188, top: 553, left: 933 },
  { name: '_0000_house1', width: 752, height: 268, top: 812, left: 560 },
];

interface MapProps {
  weather: string;
  currentEvent?: string;
}

// Primary chat objects
const initialQuestion = {
  id: 'initial',
  type: 'question',
  text: "Welcome to Kuro Town! I'm Mayor. Before we get started, I'd love to learn more about you!, Are you already registered with us?",
};

const MapComponent = ({ weather }: MapProps) => {
  const { data: session, status } = useSession();

  // Panning and zoom state
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // Hover state (set via buttons only)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

  // Initialize Kuro at his house
  const [positions, setPositions] = useState<Array<string>>(
    aiAgents.map((agent) => agent.location)
  );
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isCharacterStatsDialogOpen, setIsCharacterStatsDialogOpen] = useState(false);
  const [selectedCharacterName, setSelectedCharacterName] = useState('Kuro');
  const [selectedAgent, setSelectedAgent] = useState<{
    id: number;
    name: string;
    location: string;
    avatar: string;
    color: string;
    isMainAgent: boolean;
  } | null>(null);
  const [isAgentDialogOpen, setIsAgentDialogOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(
    new Date(2025, 1, Math.floor(Math.random() * 4 + 1), 6, 0)
  );
  const [isNight, setIsNight] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([0.5]);

  interface CitizenshipApplication {
    status: string;
    twitter_id: string;
  }

  const [citizenshipApplication, setCitizenshipApplication] =
    useState<CitizenshipApplication | null>(null);
  const [showApplicationSuccessAlert, setShowApplicationSuccessAlert] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<
    { id: string; type: string; text: string | ReactNode }[]
  >(() => {
    // Try to get messages from sessionStorage on initial load
    const savedMessages = sessionStorage.getItem('applicationMessages');
    return savedMessages ? JSON.parse(savedMessages) : [initialQuestion];
  });

  // Update sessionStorage whenever messages change
  useEffect(() => {
    sessionStorage.setItem('applicationMessages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0];
    }
  }, [volume]);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale((containerWidth / 1920) * 1.2);
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      handleCitizenshipApplication(session.user);
    }
  }, [status, session?.user]);

  useEffect(() => {
    if (citizenshipApplication?.twitter_id && citizenshipApplication?.status !== 'approved') {
      checkApplicationStatusDebounced(citizenshipApplication.twitter_id);
    }
  }, [citizenshipApplication?.twitter_id, citizenshipApplication?.status]);

  const checkApplicationStatusDebounced = useCallback(
    debounce(async (twitterId: string) => {
      await checkAIUpdatedApplicationStatus(twitterId);
    }, 300),
    []
  );

  async function checkAIUpdatedApplicationStatus(twitterId: string) {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/mayor-review`, {
        params: { twitter_id: twitterId },
      });

      if (response.data.status) {
        await handleCitizenshipApplication(session?.user);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching citizenship status:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCitizenshipApplication(user: any) {
    setIsLoading(true);
    try {
      const isExists = await checkIfCitizenshipApplicationExists(user.id);
      if (!isExists) {
        await applyCitizenship(user);
      }
    } catch (error) {
      console.error('Error handling citizenship application:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkIfCitizenshipApplicationExists(twitterId: string) {
    if (!twitterId) {
      console.error('Twitter ID is missing');
      return false;
    }

    try {
      const response = await axios.get(`/api/citizenship/status`, {
        params: { twitter_id: twitterId },
      });
      setCitizenshipApplication(response?.data);
      return !!response?.data;
    } catch (error) {
      console.error('Error fetching citizenship status:', error);
      return false;
    }
  }

  async function applyCitizenship(user: any) {
    if (!user?.id) {
      console.error('Id missing');
      return;
    }

    try {
      await axios.post(`/api/citizenship/apply`, {
        twitter_id: user.id,
        twitter_name: user.name,
        twitter_profile_picture: user.image,
        messages,
      });

      setShowApplicationSuccessAlert(true);
      sessionStorage.removeItem('applicationMessages');
    } catch (error) {
      console.error('Error applying for citizenship:', error);
    }
  }

  const clampOffset = (newOffset: { x: number; y: number }) => {
    if (!containerRef.current) return newOffset;
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    const mapWidth = 1920 * scale;
    const mapHeight = 1080 * scale;
    const minX = containerWidth - mapWidth;
    const minY = containerHeight - mapHeight;
    return {
      x: Math.min(0, Math.max(newOffset.x, minX)),
      y: Math.min(0, Math.max(newOffset.y, minY)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newOffset = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
    setOffset(clampOffset(newOffset));
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = new Date(prevTime.getTime() + 60000);
        setIsNight(newTime.getHours() >= 20 || newTime.getHours() < 6);
        return newTime;
      });
    }, 200);
    return () => clearInterval(timeInterval);
  }, []);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setIsLocationDialogOpen(true);
  };

  const handleCharacterClick = (name: string) => {
    setSelectedCharacterName(name);
    setIsCharacterStatsDialogOpen(true);
  };
  const handleAgentClick = (agent: {
    id: number;
    name: string;
    location: string;
    avatar: string;
    color: string;
    isMainAgent: boolean;
  }) => {
    setSelectedAgent(agent);
    setIsAgentDialogOpen(true);
  };
  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'partly cloudy':
        return <CloudSun className="w-6 h-6 text-gray-400" />;
      case 'cloudy':
        return <Cloud className="w-6 h-6 text-gray-400" />;
      case 'light rain':
        return <CloudDrizzle className="w-6 h-6 text-blue-400" />;
      case 'heavy rain':
        return <CloudRain className="w-6 h-6 text-blue-600" />;
      default:
        return <Sun className="w-6 h-6 text-yellow-400" />;
    }
  };
  const getAgentsAtLocation = (locationName: string) => {
    return aiAgents.filter(
      (agent) => positions[agent.id - 1] === locationName && !agent.isMainAgent
    );
  };
  const getAgentWithName = (name: string) => {
    return aiAgents.find((agent) => agent.name === name);
  };
  const getLocation = (location: string) => {
    return locations.find((item) => item.name == location);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-slate-700 select-none"
        onMouseDownCapture={handleMouseDown}
        onMouseMoveCapture={handleMouseMove}
        onMouseUpCapture={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(/mapLayers/clouds.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            opacity: 1,
            zIndex: 10,
          }}
        />

        {/* Draggable map content */}
        <div
          className="absolute"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'top left',
            width: '1920px',
            height: '1080px',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            zIndex: 1,
          }}
        >
          <MovingClouds />

          {/* Render panned map layers */}
          {pannedLayers.map((layer, index) => {
            const extraStyles =
              structureMapping[layer.name] === hoveredLocation
                ? { transform: 'scale(1.05)', filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }
                : {};
            return (
              <img
                key={layer.name}
                src={`/mapLayers/${layer.name}.png`}
                alt={layer.name}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="transition-all duration-200"
                style={{
                  position: 'absolute',
                  left: `${layer.left}px`,
                  top: `${layer.top}px`,
                  width: `${layer.width}px`,
                  height: `${layer.height}px`,
                  zIndex: index + 2,
                  pointerEvents: 'none',
                  ...extraStyles,
                }}
              />
            );
          })}

          {/* Map Location Buttons */}
          {locations.map((location) => (
            <Popover key={`location-${location.id}`}>
              <PopoverTrigger asChild>
                <Button
                  onMouseEnter={() => setHoveredLocation(location.name)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  variant="location"
                  size="icon"
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${location.color} border border-black shadow-[2px_2px_0_0_black] outline outline-1 outline-black`}
                  style={{ left: `${location.x}%`, top: `${location.y}%`, zIndex: 101 }}
                  aria-label={`Visit ${location.name}`}
                  onClick={() => handleLocationClick(location)}
                >
                  {location.icon}
                </Button>
              </PopoverTrigger>
              <PopoverContent asChild>
                <motion.div
                  variants={popoverVariants}
                  initial="hidden"
                  animate="show"
                  className="w-64 p-0 bg-white border-2 border-black shadow-[4px_4px_0_0_black] rounded-2xl overflow-hidden bg-[url('/cloudspop.png')] bg-repeat bg-left-top bg-fixed"
                >
                  <div className="p-4 bg-pink-100 border-b-2 border-black">
                    <h3 className="text-lg font-bold text-black mb-2 font-title flex items-center gap-2">
                      {location.icon}
                      {location.name}
                    </h3>
                    <p className="text-sm text-black font-body">
                      {getLocationDescription(location.name)}
                    </p>
                    <Button
                      className="w-full mt-3 bg-black text-white hover:bg-black/80"
                      onClick={() => handleLocationClick(location)}
                    >
                      Visit Location
                    </Button>
                  </div>
                  <div className="p-4 bg-yellow-100">
                    <h4 className="text-sm font-semibold text-black mb-3 flex items-center font-title">
                      <Users className="w-4 h-4 mr-2" />
                      Characters Here
                    </h4>
                    <div className="space-y-2">
                      {getAgentsAtLocation(location.name).map((agent) => (
                        <Button
                          key={'locationAgent' + agent.id}
                          variant="secondary"
                          size="sm"
                          className="w-full justify-start text-left border-2 border-black shadow-[2px_2px_0_0_black] bg-white text-black hover:bg-white/90"
                          onClick={() => handleAgentClick(agent)}
                        >
                          {agent.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </PopoverContent>
            </Popover>
          ))}

          {/* Main Avatars */}
          {aiAgents.map(
            (agent) =>
              agent.isMainAgent && (
                <div
                  key={'AI Agents' + agent.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
                  style={{
                    left: `${
                      getLocation(positions[agent.id - 1])!.x +
                      2 * Math.pow(-1, agent.id + Math.floor(agent.id / 2))
                    }%`,
                    top: `${getLocation(positions[agent.id - 1])!.y + 2 * Math.pow(-1, agent.id)}%`,
                    zIndex: 102,
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onMouseEnter={() => setHoveredLocation('Kuro')}
                          onMouseLeave={() => setHoveredLocation(null)}
                          variant="ghost"
                          className="w-12 h-12 rounded-full bg-black border-2 border-yellow-400 shadow-md transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50 p-0"
                          onClick={(e) => handleCharacterClick(agent.name)}
                          aria-label="Kuro's current location"
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback className={agent.color}>
                              {agent.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{positions[agent.id - 1]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
          )}
        </div>

        {/* Fixed UI Overlays (2% padding from edges) */}
        <div className="absolute" style={{ top: '2%', right: '2%', zIndex: 1100 }}>
          <div className="bg-pink-100 p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black] flex items-center space-x-4">
            <audio ref={audioRef} src="/audio/track.mp3" loop />
            <div className="flex items-center space-x-2">
              {getWeatherIcon(weather)}
              <span className="text-sm font-bold text-black">{weather}</span>
            </div>
            <div className="h-8 w-[1px] bg-black/20"></div>
            <div className="flex items-center space-x-2">
              {isNight ? (
                <Moon className="w-6 h-6 text-purple-600" />
              ) : (
                <Sunrise className="w-6 h-6 text-orange-600" />
              )}
              <span className="text-sm font-bold text-black">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="h-8 w-[1px] bg-black/20"></div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    if (isPlaying) {
                      audioRef.current.pause();
                    } else {
                      audioRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }
                }}
                className="w-8 h-8 rounded-full bg-violet-500 hover:bg-violet-600 flex items-center justify-center transition-colors border border-black"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white translate-x-[1px]" />
                )}
              </button>
              <div className="flex items-center space-x-2 min-w-[100px]">
                <Volume2 className="w-4 h-4 text-violet-600" />
                <Slider
                  defaultValue={[0.5]}
                  max={1}
                  step={0.1}
                  value={volume}
                  onValueChange={setVolume}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute" style={{ top: '2%', left: '2%', zIndex: 1100 }}>
          <KuroStatus
            citizenshipApplication={citizenshipApplication}
            handleCitizenshipApplication={handleCitizenshipApplication}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Dialogs */}
        <style jsx global>
          {customScrollbarStyles}
        </style>

        <AnimatePresence>
          {isLocationDialogOpen && (
            <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
              <DialogContent className="p-0 bg-transparent border-none shadow-none">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="sm:max-w-[600px] bg-white border-2 border-black shadow-[4px_4px_0_0_black] rounded-2xl overflow-hidden bg-[url('/cloudspop.png')] bg-repeat bg-left-top bg-fixed"
                >
                  <DialogHeader className="p-4 bg-pink-100 border-b-2 border-black">
                    <DialogTitle className="text-2xl font-bold text-black flex items-center gap-2 font-title">
                      {selectedLocation?.icon}
                      {selectedLocation?.name}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="max-h-[75vh] overflow-y-auto scroll-smooth">
                    {selectedLocation?.name === 'Town Hall' && status !== 'authenticated' ? (
                      <ApplicationProcessModal
                        messages={messages}
                        setMessages={setMessages}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                    ) : (
                      <>
                        <Tabs defaultValue="info" className="w-full p-4">
                          <TabsList className="grid w-full grid-cols-3 p-1 bg-black rounded-xl mb-4">
                            <TabsTrigger
                              value="info"
                              className="data-[state=active]:bg-pink-100 data-[state=active]:text-black text-white"
                            >
                              Information
                            </TabsTrigger>
                            <TabsTrigger
                              value="characters"
                              className="data-[state=active]:bg-yellow-100 data-[state=active]:text-black text-white"
                            >
                              Characters
                            </TabsTrigger>
                            <TabsTrigger
                              value="activities"
                              className="data-[state=active]:bg-green-100 data-[state=active]:text-black text-white"
                            >
                              Activities
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent
                            value="info"
                            className="mt-0 h-[250px] relative overflow-hidden"
                          >
                            <motion.div
                              variants={itemVariants}
                              initial="hidden"
                              animate="show"
                              exit="exit"
                              className="absolute inset-0"
                            >
                              <DialogDescription className="text-black font-body bg-pink-50 p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black] mb-4">
                                {selectedLocation && getLocationDescription(selectedLocation.name)}
                              </DialogDescription>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-yellow-100 p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black]">
                                  <h4 className="text-sm font-semibold text-black mb-2 flex items-center font-title">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Opening Hours
                                  </h4>
                                  <p className="text-sm text-black font-body">
                                    {selectedLocation && getLocationHours(selectedLocation.name)}
                                  </p>
                                </div>
                                <div className="bg-green-100 p-4 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black]">
                                  <h4 className="text-sm font-semibold text-black mb-2 flex items-center font-title">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Location Details
                                  </h4>
                                  <p className="text-sm text-black font-body">
                                    {selectedLocation && getLocationDetails(selectedLocation.name)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </TabsContent>
                          <TabsContent
                            value="characters"
                            className="mt-0 h-[250px] relative overflow-hidden"
                          >
                            <motion.div
                              variants={itemVariants}
                              initial="hidden"
                              animate="show"
                              exit="exit"
                              className="absolute inset-0"
                            >
                              <ScrollArea className="h-full pr-4 custom-scrollbar">
                                {selectedLocation &&
                                  getAgentsAtLocation(selectedLocation.name).map((agent) => (
                                    <div
                                      key={agent.id}
                                      className="flex items-center space-x-4 mb-4 p-4 bg-yellow-100 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black]"
                                    >
                                      <Avatar className="w-10 h-10 border-2 border-black">
                                        <AvatarImage src={agent.avatar} alt={agent.name} />
                                        <AvatarFallback className={agent.color}>
                                          {agent.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h4 className="text-sm font-semibold text-black font-title">
                                          {agent.name}
                                        </h4>
                                        <p className="text-xs text-black/70 font-body">
                                          From {agent.location}
                                        </p>
                                      </div>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        className="ml-auto border-2 border-black shadow-[2px_2px_0_0_black] bg-white text-black hover:bg-white/90"
                                        onClick={() => handleAgentClick(agent)}
                                      >
                                        Interact
                                      </Button>
                                    </div>
                                  ))}
                              </ScrollArea>
                            </motion.div>
                          </TabsContent>
                          <TabsContent
                            value="activities"
                            className="mt-0 h-[250px] relative overflow-hidden"
                          >
                            <motion.div
                              variants={itemVariants}
                              initial="hidden"
                              animate="show"
                              exit="exit"
                              className="absolute inset-0"
                            >
                              <ScrollArea className="h-full pr-4 custom-scrollbar">
                                {selectedLocation &&
                                  getLocationActivities(selectedLocation.name).map(
                                    (activity, index) => (
                                      <div
                                        key={index}
                                        className="mb-4 p-4 bg-green-100 rounded-2xl border-2 border-black shadow-[2px_2px_0_0_black]"
                                      >
                                        <h4 className="text-sm font-semibold text-black mb-2 font-title">
                                          {activity.name}
                                        </h4>
                                        <p className="text-xs text-black/70 font-body">
                                          {activity.description}
                                        </p>
                                      </div>
                                    )
                                  )}
                              </ScrollArea>
                            </motion.div>
                          </TabsContent>
                        </Tabs>
                        <DialogFooter className="mt-4 p-4 bg-pink-50 border-t-2 border-black">
                          <Button
                            onClick={() => setIsLocationDialogOpen(false)}
                            className="bg-black text-white hover:bg-black/80"
                          >
                            Close
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* Kuro Stats Dialog */}
        <CharacterStatsDialog
          open={isCharacterStatsDialogOpen}
          onOpenChange={setIsCharacterStatsDialogOpen}
          name={selectedCharacterName}
        />

        {/* AI Agent Dialog */}
        <AIAgentDialog
          open={isAgentDialogOpen}
          onOpenChange={setIsAgentDialogOpen}
          agent={selectedAgent}
          date={currentTime}
        />

        {/* Expandable Chat */}
        <ExpandableChat currentTime={currentTime} />
      </div>
      <div className="z-50">
        <Alert title="Hi I am Depak" />
      </div>

      {showApplicationSuccessAlert && (
        <MotionAlert
          title="Congratulations"
          message="You have successfully applied for citizenship in Kuro's Universe"
          onClose={() => setShowApplicationSuccessAlert(false)}
        />
      )}
    </>
  );
};

function getLocationDescription(locationName: string) {
  switch (locationName) {
    case 'Coffee Shop':
      return 'A cozy spot where Kuro can watch people and enjoy the aroma of coffee. The warm atmosphere and gentle chatter make it a perfect place for Kuro to relax and observe human behavior.';
    case 'Park':
      return 'A lush green space with plenty of trees for Kuro to climb and explore. The park offers various exciting smells, birds to watch, and occasionally other friendly animals to interact with.';
    case 'Office Building':
      return 'A tall building with lots of windows, perfect for Kuro to observe the busy human world. The constant movement of people and the occasional open window provide endless entertainment.';
    case 'Town Hall':
      return "An interesting place with various smells and packages that pique Kuro's curiosity. The constant flow of people and parcels keeps Kuro engaged and intrigued.";
    case "Kuro's House":
      return "Kuro's safe haven, filled with comfortable spots for napping and playing. This is where Kuro feels most at home, with familiar scents and cozy corners to curl up in.";
    case 'Newspaper Stand':
      return 'A small booth with fresh papers that Kuro finds irresistible to sit on. The crisp smell of new print and the occasional treat from the friendly vendor make this a favorite spot.';
    case 'Grocery Store':
      return "A place full of interesting smells and potential for finding dropped treats. The variety of scents from fresh produce to the deli counter keeps Kuro's senses stimulated.";
    case 'Fashion Store':
      return 'A store with soft fabrics and many hiding spots for Kuro to explore. The changing rooms and clothing racks provide excellent places for an adventurous cat to investigate.';
    default:
      return "An interesting location in Kuro's world.";
  }
}

function getLocationHours(locationName: string) {
  switch (locationName) {
    case 'Coffee Shop':
      return 'Open daily: 6:00 AM - 10:00 PM';
    case 'Park':
      return 'Open 24/7';
    case 'Office Building':
      return 'Monday - Friday: 8:00 AM - 6:00 PM';
    case 'Town Hall':
      return 'Monday - Saturday: 9:00 AM - 5:00 PM';
    case "Kuro's House":
      return 'Always open for Kuro!';
    case 'Newspaper Stand':
      return 'Daily: 5:00 AM - 7:00 PM';
    case 'Grocery Store':
      return 'Daily: 7:00 AM - 11:00 PM';
    case 'Fashion Store':
      return 'Monday - Saturday: 10:00 AM - 9:00 PM, Sunday: 11:00 AM - 6:00 PM';
    default:
      return 'Hours vary';
  }
}

function getLocationDetails(locationName: string) {
  switch (locationName) {
    case 'Coffee Shop':
      return 'A quaint two-story building with outdoor seating and a cozy interior.';
    case 'Park':
      return 'Sprawling green space with walking paths, a pond, and plenty of trees.';
    case 'Office Building':
      return 'Modern high-rise in the heart of downtown with 20 floors of offices.';
    case 'Town Hall':
      return 'Classic brick building with multiple service counters and a sorting area.';
    case "Kuro's House":
      return 'Charming two-bedroom home with a spacious backyard and cat-friendly features.';
    case 'Newspaper Stand':
      return 'Compact kiosk located on a busy street corner, always buzzing with activity.';
    case 'Grocery Store':
      return 'Large supermarket with wide aisles and a diverse selection of products.';
    case 'Fashion Store':
      return 'Trendy boutique with large display windows and multiple changing rooms.';
    default:
      return "Unique location in Kuro's world.";
  }
}

function getLocationActivities(locationName: string) {
  switch (locationName) {
    case 'Coffee Shop':
      return [
        {
          name: 'People Watching',
          description: 'Observe the diverse clientele and their interactions.',
        },
        {
          name: 'Nap in Sunbeam',
          description: 'Find a cozy spot by the window for a peaceful nap.',
        },
        {
          name: 'Beg for Treats',
          description: 'Try your luck with friendly customers for a tasty morsel.',
        },
      ];
    case 'Park':
      return [
        {
          name: 'Tree Climbing',
          description: 'Test your agility on various trees throughout the park.',
        },
        {
          name: 'Bird Watching',
          description: 'Observe the local bird population from hidden vantage points.',
        },
        {
          name: 'Butterfly Chase',
          description: 'Engage in a playful pursuit of colorful butterflies.',
        },
      ];
    case 'Office Building':
      return [
        {
          name: 'Window Perching',
          description: "Find the perfect windowsill for a bird's eye view of the city.",
        },
        {
          name: 'Paper Chase',
          description: 'Investigate loose papers and their intriguing rustling sounds.',
        },
        {
          name: 'Elevator Ride',
          description: 'Sneak into the elevator for an exciting vertical adventure.',
        },
      ];
    case 'Town Hall':
      return [
        {
          name: 'Box Inspection',
          description: 'Examine various packages and their interesting scents.',
        },
        {
          name: 'Stamp Collection',
          description: 'Hunt for fallen stamps and add them to your collection.',
        },
        {
          name: 'Mail Cart Ride',
          description: 'Hitch a ride on a moving mail cart for a tour of the facility.',
        },
      ];
    case "Kuro's House":
      return [
        { name: 'Sunbathing', description: 'Find the perfect sunny spot for a relaxing sunbath.' },
        { name: 'Toy Mouse Hunt', description: 'Search for hidden toy mice throughout the house.' },
        {
          name: 'Cardboard Box Fun',
          description: 'Explore new cardboard boxes and make them your fort.',
        },
      ];
    case 'Newspaper Stand':
      return [
        { name: 'Paper Surfing', description: 'Slide across freshly laid out newspapers.' },
        { name: 'Headline Reading', description: 'Attempt to decipher the latest news headlines.' },
        {
          name: 'Magazine Tower Toppling',
          description: 'Carefully knock over stacks of magazines.',
        },
      ];
    case 'Grocery Store':
      return [
        {
          name: 'Produce Inspection',
          description: 'Investigate the various scents in the produce section.',
        },
        { name: 'Box Fort Building', description: 'Create a fort using empty cardboard boxes.' },
        {
          name: 'Fish Counter Stakeout',
          description: 'Watch the activity at the fish counter with great interest.',
        },
      ];
    case 'Fashion Store':
      return [
        {
          name: 'Clothing Rack Hide and Seek',
          description: 'Find the perfect hiding spot among the clothes.',
        },
        {
          name: 'Dressing Room Mirror Play',
          description: 'Interact with your reflection in the dressing room mirrors.',
        },
        {
          name: 'Mannequin Observation',
          description: 'Study the strange, motionless humans on display.',
        },
      ];
    default:
      return [
        { name: 'Explore', description: 'Discover the unique features of this location.' },
        { name: 'Nap', description: 'Find a cozy spot for a quick nap.' },
        { name: 'People Watch', description: 'Observe the comings and goings of visitors.' },
      ];
  }
}

export default MapComponent;
