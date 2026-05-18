import { FaWhatsapp, FaPlay, FaUser, FaMoneyBillWave } from 'react-icons/fa';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

const EventCard = ({ event, onOpen }) => {
    const message = encodeURIComponent(
        `I love the "${event.title}" event! Can you plan something similar?`
    );

    return (
        <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden flex flex-col group">
            {/* Cover Image */}
            <div
                className="relative cursor-pointer overflow-hidden h-48 sm:h-56"
                onClick={onOpen}
            >
                <img
                    src={
                        event.coverImage ||
                        event.gallery?.[0] ||
                        'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'
                    }
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
                {event.gallery?.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                        +{event.gallery.length - 1}
                    </span>
                )}
                {event.videoLink && (
                    <a
                        href={event.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}  // prevent opening lightbox
                        className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-red-500 transition"
                        title="Watch video"
                    >
                        <FaPlay size={12} />
                    </a>
                )}
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                {event.date && (
                    <p className="text-gray-500 text-sm mb-2">
                        {new Date(event.date).toLocaleDateString()}
                    </p>
                )}

                {/* Client name & Price */}
                <div className="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-600">
                    {event.clientName && (
                        <span className="flex items-center gap-1">
                            <FaUser className="text-brand" /> {event.clientName}
                        </span>
                    )}
                    {event.price && (
                        <span className="flex items-center gap-1 font-medium text-brand">
                            <FaMoneyBillWave /> {event.price}
                        </span>
                    )}
                </div>

                {/* Short client testimonial preview (optional) */}
                {event.clientTestimonial && (
                    <p className="text-gray-500 text-xs italic mb-3 line-clamp-2">
                        “{event.clientTestimonial}”
                    </p>
                )}

                {/* Action Buttons */}
                <div className="mt-auto flex gap-2">
                    <button
                        onClick={onOpen}
                        className="flex-1 text-center py-2 border border-brand text-brand rounded-full text-sm font-medium hover:bg-brand hover:text-white transition"
                    >
                        View Photos
                    </button>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 justify-center px-4 py-2 bg-green-500 text-white rounded-full text-sm font-medium hover:bg-green-600 transition"
                    >
                        <FaWhatsapp /> Enquire
                    </a>
                </div>
            </div>
        </div>
    );
};

export default EventCard;