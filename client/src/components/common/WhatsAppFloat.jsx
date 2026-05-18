import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppFloat = () => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
    const message = encodeURIComponent("Hi! I'm interested in your event planning services.");
    const url = `https://wa.me/${phone}?text=${message}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-bounce"
        >
            <FaWhatsapp size={28} />
        </a>
    );
};

export default WhatsAppFloat;