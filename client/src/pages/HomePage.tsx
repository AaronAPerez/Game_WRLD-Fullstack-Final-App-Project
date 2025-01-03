import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad, Calendar, TrendingUp, 
  ChevronRight, 
} from 'lucide-react';
import { gameService } from '../services/gameService';
import { GameCard } from '../components/game/GameCard';
import type { Game } from '../types/rawg';
import FeaturedGames from '../components/FeaturedGames';
import { GameDetailsModal } from '../components/GameDetailsModal';


export default function  HomePage() {
  const [selectedGame, setSelectedGame] = useState(null);


  // Fetch New Releases (last 30 days)
  // const { data: newReleases } = useQuery({
  //   queryKey: ['newReleases'],
  //   queryFn: () => {
  //     const thirtyDaysAgo = new Date();
  //     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
  //     return gameService.getGames({
  //       dates: `${thirtyDaysAgo.toISOString().split('T')[0]},${new Date().toISOString().split('T')[0]}`,
  //       ordering: '-released',
  //       page_size: 4
  //     });
  //   }
  // });

  // Fetch Upcoming Games (next 6 months)
  const { data: upcomingGames } = useQuery({
    queryKey: ['upcomingGames'],
    queryFn: () => {
      const sixMonthsLater = new Date();
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      
      return gameService.getGames({
        dates: `${new Date().toISOString().split('T')[0]},${sixMonthsLater.toISOString().split('T')[0]}`,
        ordering: 'released',
        page_size: 6
      });
    }
  });

  // Fetch Trending Games (high metacritic)
  const { data: trendingGames } = useQuery({
    queryKey: ['trendingGames'],
    queryFn: () => gameService.getGames({
      ordering: '-metacritic',
      metacritic: '80,100',
      page_size: 6
    })
  });

  return (
    <div className="min-h-screen space-y-12">
      {/* Hero Section */}
      <FeaturedGames/>


      {/* Game Categories */}
      <div className="container mx-auto">
        {/* New Releases */}
        {/* <GameSection
          title="New Releases"
          icon={Calendar}
          games={newReleases?.results || []}
          onGameSelect={setSelectedGame}
        /> */}

   
        {/* Trending Now */}
        <GameSection
          title="Trending Now"
          icon={TrendingUp}
          games={trendingGames?.results || []}
          onGameSelect={setSelectedGame}
        />
      </div>

              {/* Upcoming Games */}
              <GameSection
          title="Upcoming Games"
          icon={Gamepad}
          games={upcomingGames?.results || []}
          onGameSelect={setSelectedGame}
        />

      {/* Game Details Modal */}
      <AnimatePresence>
        {selectedGame && (
          <GameDetailsModal
            gameId={selectedGame.id}
            onClose={() => setSelectedGame(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Game Section Component
interface GameSectionProps {
  title: string;
  games: Game[];
  onGameSelect: (game: Game) => void;
}

function GameSection({ title, games, onGameSelect }: GameSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        
        {/* <button className="text-app-accent-primary hover:text-app-accent-primary/80 
                        flex items-center gap-1">
          View All
          <ChevronRight className="w-4 h-4" />
        </button> */}
      </div>
    {/* Games Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2
    xl:grid-cols-3 gap-2">
    {games.map((game: Game, index: number) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GameCard
              game={game} 
              onClick={() => 
              onGameSelect(game)}
              rank={index + 1} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
