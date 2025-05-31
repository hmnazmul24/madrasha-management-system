"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllMadrasha } from "../server/all.action";
import MadrashaSkeleton from "./MadrashaSkeleton";
import MadrashaCard from "./MadrashaCard";

const AllMadrasha = () => {
  const { isPending, data } = useQuery({
    queryKey: ["all-madrasha"],
    queryFn: async () => await getAllMadrasha(),
  });

  return (
    <div>
      {isPending ? (
        <div className="flex items-start flex-wrap gap-2">
          <MadrashaSkeleton />
          <MadrashaSkeleton />
        </div>
      ) : (
        <div>
          {data && data.length ? (
            <div className="flex items-start flex-wrap gap-2">
              {data.map((item) => (
                <MadrashaCard info={item} key={item.id} />
              ))}
            </div>
          ) : (
            <div className="text-yellow-500">No Madrasha Exist.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllMadrasha;
