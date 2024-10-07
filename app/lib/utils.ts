import { Album, Track } from "./types";

export const convertArtistData = (data: any): Artist => {
  return {
    id: data.id,
    name: data.name,
    images: data.images?.map((img: any) => ({
      url: img.url,
      height: img.height,
      width: img.width
    })),
    externalUrl: data.external_urls.spotify,
    genres: data.genres
  };
}


export const convertAlbumData = (data: any): Album => {
  return {
    id: data.id,
    name: data.name,
    artists: data.artists.map((artist: any) => convertArtistData(artist)),
    images: data.images.map((img: any) => ({
      url: img.url,
      height: img.height,
      width: img.width
    })),
    releaseDate: data.release_date,
    totalTracks: data.total_tracks,
    externalUrl: data.external_urls.spotify,
  };
}

export const convertTrackData = (data: any): Track => {
  return {
    id: data.id,
    album: convertAlbumData(data.album),
    trackName: data.name,
    artists: data.artists.map((artist: any) => convertArtistData(artist)),
    externalUrl: data.external_urls.spotify,
    previewUrl: data.preview_url,
    trackNumber: data.track_number
  };
}
