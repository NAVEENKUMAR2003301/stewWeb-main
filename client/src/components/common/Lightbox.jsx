import { useState } from 'react';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

const Lightbox = ({ event, onClose }) => {
    const images = event?.gallery?.length > 0 ? event.gallery : [event?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'];
    const [currentIndex, setCurrentIndex] = useState(0);

    const goTo = (direction) => {
        setCurrentIndex((prev) => {
            if (direction === 'next') return (prev + 1) % images.length;
            return (prev - 1 + images.length) % images.length;
        });
    };

    const message = encodeURIComponent(`Hi! I saw the "${event?.title}" event and I'm interested in a similar setup.`);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 text-white">
                <button onClick={onClose} className="text-2xl p-2">
                    <IoClose />
                </button>
                <h2 className="text-lg font-semibold truncate max-w-[200px]">{event?.title}</h2>
                <a
                    href={`https://wa.me/${whatsappNumber}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition"
                >
                    <FaWhatsapp /> Enquire
                </a>
            </div>

            {/* Image area */}
            <div className="flex-1 flex items-center justify-center relative px-4">
                {/* Previous button */}
                {images.length > 1 && (
                    <button
                        onClick={() => goTo('prev')}
                        className="absolute left-2 sm:left-4 text-white text-3xl p-2 bg-black/30 rounded-full z-10 hover:bg-black/50 transition"
                    >
                        <IoChevronBack />
                    </button>
                )}

                <img
                    src={images[currentIndex]}
                    alt={event?.title}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />

                {/* Next button */}
                {images.length > 1 && (
                    <button
                        onClick={() => goTo('next')}
                        className="absolute right-2 sm:right-4 text-white text-3xl p-2 bg-black/30 rounded-full z-10 hover:bg-black/50 transition"
                    >
                        <IoChevronForward />
                    </button>
                )}
            </div>

            {/* Image counter */}
            {images.length > 1 && (
                <div className="text-center text-white text-sm py-2">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Swipe hint on mobile – can be implemented with touch events if needed */}
        </div>
    );
};

export default Lightbox;