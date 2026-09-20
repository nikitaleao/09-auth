'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen onClose={handleClose}>
      <div className={css.container}>
        <button
          type="button"
          onClick={handleClose}
          className={css.closeButton}
          aria-label="Close modal"
        >
          &times;
        </button>

        {isLoading && <p>Loading note...</p>}
        {isError && <p>Failed to load note preview.</p>}

        {note && (
          <div className={css.content}>
            <h2>{note.title}</h2>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.text}>{note.content}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
