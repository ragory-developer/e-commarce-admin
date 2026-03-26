// MediaModal.jsx
import MediaBrowser from "@/Components/MediaBrowser/MediaBrowser";

export default function MediaModal({ isOpen, onClose, onInsert }) {
  if (!isOpen) return null;
  return (
    <>
      <MediaBrowser mode="modal" onInsert={onInsert} onClose={onClose} />;
    </>
  );
}
