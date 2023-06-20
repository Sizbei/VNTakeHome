import { Prisma } from "@prisma/client";

export function getSortOrder(orderBy?: string): Prisma.SortOrder {
  if (orderBy === "movieName_ASC") {
    return Prisma.SortOrder.asc;
  } else if (orderBy === "movieName_DESC") {
    return Prisma.SortOrder.desc;
  }

  // Default sorting order
  return Prisma.SortOrder.asc;
}

export function getPagination(skip?: number, take?: number): Prisma.MovieFindManyArgs | undefined {
  if (skip !== undefined && take !== undefined) {
    return {
      skip,
      take,
    };
  }

  return undefined;
}
