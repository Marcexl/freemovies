export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Poster: string
  Type?: string
}

export interface MovieDetail extends Movie {
  Plot: string
  Director: string
  Actors: string
  Awards: string
  imdbRating: string
  Genre: string
  Runtime: string
  Released: string
  Writer: string
  Language: string
  Country: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response?: string
}

export interface OMDBResponse {
  Search?: Movie[]
  totalResults?: string
  Response: string
  Error?: string
}

