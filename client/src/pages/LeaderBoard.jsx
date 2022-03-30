import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getLeaderBoard } from '../store/actions';

const LeaderBoard = ({getLeaderBoard, leaderBoard}) => {
    const [leaderboardType, setLeaderBoardType] = useState("latest_poll");

    const isViewingLatest = leaderboardType === "latest_poll";

    const leaders = leaderBoard[leaderboardType] || []

    useEffect(() => {
        getLeaderBoard()
    }, []);

    return (
        <center>
            <h1>Leaderboard</h1>
            <select onChange={(e) => setLeaderBoardType(e.target.value)}>
                <option value="latest_poll">Latest Poll</option>
                <option value="all_time">All Time</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th>#</th><th>Username</th><th>Points</th>{isViewingLatest && <th>Option</th>}
                    </tr>
                </thead>
                <tbody>
                    {leaders.map(({xp, token, option=""}, i) => {
                        return (
                            <tr key={token}>
                                <td>{i+1}</td><td>{token}</td><td>{xp}</td>{isViewingLatest && <td>{option}</td>}
                            </tr>
                        )
                    })}
                    
                </tbody>
            </table>
        </center>
    );
}

function map_state_to_props({leaderBoard}){
    return {leaderBoard}
}
 
export default connect(map_state_to_props, {getLeaderBoard})(LeaderBoard);