import { MediaType } from '@/app/lib/types';
import useSWR from 'swr';
import { Album } from '@spotify/web-api-ts-sdk';
import { convertAlbumData, swrFetcher } from '@/app/lib/utils';
import MeidaPreview from '../mediaPreview';

export default function AlbumPreview(props: { id: string }) {
  const { data, error, isLoading } = useSWR<Album, Error>(
    `/api/spotify/album/${props.id}`,
    swrFetcher,
    { revalidateOnFocus: false }
  );

  const onSave = async (data: Album) => {
    const saveData = {
      id: data?.id,
      name: data?.name,
      artist: data?.artists.map((artist) => artist.name).join(', '),
      totalTracks: data?.total_tracks,
      releaseDate: data?.release_date,
      externalUrls: data?.external_urls,
      genres: data?.genres,
      imageUrl: data?.images[0]?.url,
    };

    try {
      const response = await fetch(`/api/database/addAlbum`, {
        method: 'POST',
        body: JSON.stringify(saveData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to save album');
      }

      console.log('Save successful');
    } catch (error) {
      console.error('Error saving album:', error);
    }
  };

  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Album Loading...</div>;
  if (!data) return <div>No album...</div>;

  const { name, artists, externalUrl, images } = convertAlbumData(data);
  return (
    <div>
      <MeidaPreview
        title={name}
        subTitle={artists.map((artist) => artist.name).join(', ')}
        imageUrl={images[0].url ?? ''}
        externalUrl={externalUrl}
        type={MediaType.Album}
      />
      <div className='mt-5'>
        <button
          onClick={() => onSave(data)}
          className='rounded-md bg-white text-black p-2'
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
