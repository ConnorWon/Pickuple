"use client";
import { useUserContext } from "../GlobalContext";
import { deleteGame, fetchGameHistory } from "../services/gameServices";
import GameManager from "../upcomingComponents/gameManager";
import React, { useEffect, useState } from "react";
import { Game } from "../utils/types";
import { Modal, Typography } from "@mui/material";

export function HistoryPage() {
  const { userID } = useUserContext();
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [noGames, setNoGames] = useState(false);
  const [openDeleteResult, setOpenDeleteResult] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<[Boolean, string] | []>([]);

  useEffect(() => {
    handleFetchGameHistory();
  }, [userID]);

  const handleFetchGameHistory = async () => {
    const games = await fetchGameHistory(userID!);
    if (games.length > 0) {
      setData(games);
    } else {
      setNoGames(true);
      console.log("failed to fetch games");
    }
    setLoading(false);
  }

  const handleDeleteGame = async (inviteID: number) => {
    const result = await deleteGame(inviteID);
    if (result) {
      await handleFetchGameHistory();
      setDeleteMessage([true, "Game was successfully deleted."]);
    } else {
      setDeleteMessage([false, "There was an issue when deleting the game."]);
    }
    setOpenDeleteResult(true);
  }

  return (
    <div className="flex-1 flex flex-col items-center p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col items-center w-full max-w-[100%] gap-8">
        <h1 className="text-4xl font-bold text-center mb-4">PAST HISTORY</h1>
        {loading ? (
          <p>Loading...</p>
        ) : noGames ? (
          <p className="text-lg">You currently have no past games.</p>
        ) : (
          <GameManager games={data} handleDelete={handleDeleteGame} joinable={false} handleJoin={() => {}} />
        )}
      </main>
      <Modal 
          open={openDeleteResult}
          onClose={() => setOpenDeleteResult(false)}
      >
        <div className='flex flex-col delete-game-modal items-center gap-3'>
            <Typography variant='h6' className={`flex items-center ${deleteMessage[0] ? 'text-green-400' : 'text-red-400'}`}>
                {deleteMessage[1]}
            </Typography>
        </div>
      </Modal>
    </div>
  );
}
