import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  Share2,
  Check,
  Package,
  Layers,
  ShoppingBag,
  X,
  CreditCard,
  Truck,
  Heart,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PhotoBook, Album, Photo, BookCoverType, BookPaperType, BookPageLayout } from '../types';

interface PhotoBookStudioProps {
  photoBooks: PhotoBook[];
  albums: Album[];
  photos: Photo[];
  selectedAlbumForBook?: Album | null;
  onOrderBook: (bookId: string) => void;
  onCreateBookFromAlbum: (albumId: string, coverType: BookCoverType) => void;
}

export const PhotoBookStudio: React.FC<PhotoBookStudioProps> = ({
  photoBooks,
  albums,
  photos,
  selectedAlbumForBook,
  onOrderBook,
  onCreateBookFromAlbum,
}) => {
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedCoverType, setSelectedCoverType] = useState<BookCoverType>('linen');
  const [selectedPaperType, setSelectedPaperType] = useState<BookPaperType>('lustre');
  const [selectedSize, setSelectedSize] = useState<'8x8' | '10x10' | '12x12'>('10x10');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Checkout form
  const [shippingName, setShippingName] = useState('Alex Miller');
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Austin, TX 78704');
  const [giftNote, setGiftNote] = useState('A celebration of our favorite memories together.');
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const currentBook = photoBooks[activeBookIndex] || photoBooks[0];

  const coverOptions: { id: BookCoverType; label: string; priceAdd: number; desc: string }[] = [
    { id: 'linen', label: 'Embossed Linen', priceAdd: 0, desc: 'Woven fabric cover with gold foil debossing' },
    { id: 'hardcover', label: 'Matte Hardcover', priceAdd: 4, desc: 'Sturdy library bind with velvety soft-touch finish' },
    { id: 'leatherette', label: 'Classic Leatherette', priceAdd: 8, desc: 'Hand-stitched faux leather with ribbon bookmark' },
    { id: 'softcover', label: 'Layflat Softcover', priceAdd: -6, desc: 'Lightweight flexible cover with layflat spine' },
  ];

  const paperOptions: { id: BookPaperType; label: string; desc: string }[] = [
    { id: 'lustre', label: '200gsm Lustre Finish', desc: 'Subtle sheen, finger-print resistant archival paper' },
    { id: 'matte', label: 'Archival Matte Art Paper', desc: 'Museum-grade non-reflective cotton texture' },
    { id: 'glossy', label: 'Vibrant High Gloss', desc: 'Maximum color saturation & deep blacks' },
  ];

  // Calculate pricing based on options
  const basePrice = currentBook ? currentBook.price : 38.50;
  const coverAdd = coverOptions.find((c) => c.id === selectedCoverType)?.priceAdd || 0;
  const sizeAdd = selectedSize === '12x12' ? 12 : selectedSize === '8x8' ? -5 : 0;
  const totalPrice = (basePrice + coverAdd + sizeAdd).toFixed(2);

  const totalPages = currentBook?.pages.length || 1;

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleShareBookLink = () => {
    navigator.clipboard?.writeText?.(`https://memoryvault.app/photobook/preview/${currentBook?.id || 'book-1'}`);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderComplete(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    if (currentBook) {
      onOrderBook(currentBook.id);
    }
  };

  const currentPage = currentBook?.pages[currentPageIndex];
  const pagePhotos = currentPage?.photoIds.map((id) => photos.find((p) => p.id === id)).filter(Boolean) as Photo[];

  return (
    <div className="space-y-4 pb-24 animate-fade-in text-stone-100">
      {/* Studio Header */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-white tracking-tight">
              Physical Photo Book Studio
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              PRINT READY
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            Turn your digital albums into tangible heirloom coffee table books.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareBookLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>{copiedShareLink ? 'Link Copied!' : 'Share Flipbook'}</span>
          </button>

          <button
            onClick={() => {
              setOrderComplete(false);
              setShowOrderModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Order Physical Print • ${totalPrice}</span>
          </button>
        </div>
      </div>

      {/* Book Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {photoBooks.map((bk, idx) => (
          <button
            key={bk.id}
            onClick={() => {
              setActiveBookIndex(idx);
              setCurrentPageIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl shrink-0 font-medium transition-all ${
              activeBookIndex === idx
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
            }`}
          >
            {bk.title} ({bk.size})
          </button>
        ))}
      </div>

      {/* Interactive 2-Page Spread Book Flipper */}
      <div className="relative p-4 sm:p-8 rounded-3xl bg-stone-950 border-2 border-stone-800 shadow-2xl overflow-hidden">
        {/* Book spine line shadow */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-black/50 via-black/20 to-black/50 pointer-events-none z-10 hidden sm:block"></div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[340px]">
          {/* Left Page */}
          <div className="w-full sm:w-1/2 aspect-square bg-stone-100 rounded-l-xl p-6 text-stone-900 flex flex-col justify-between shadow-xl border-r border-stone-300">
            <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase tracking-widest font-mono">
              <span>{currentBook?.title}</span>
              <span>Page {currentPageIndex * 2 + 1}</span>
            </div>

            <div className="flex-1 my-4 flex items-center justify-center overflow-hidden rounded-lg bg-stone-200">
              {pagePhotos[0] ? (
                <img
                  src={pagePhotos[0].url}
                  alt={pagePhotos[0].title}
                  className="w-full h-full object-cover shadow-xs"
                />
              ) : (
                <div className="p-4 text-center text-xs text-stone-500 italic">
                  Cover spread portrait
                </div>
              )}
            </div>

            <p className="font-serif text-xs text-stone-700 italic text-center">
              {currentPage?.caption || pagePhotos[0]?.title}
            </p>
          </div>

          {/* Right Page */}
          <div className="w-full sm:w-1/2 aspect-square bg-stone-100 rounded-r-xl p-6 text-stone-900 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between text-[10px] text-stone-400 uppercase tracking-widest font-mono">
              <span>MemoryVault Print Edition</span>
              <span>Page {currentPageIndex * 2 + 2}</span>
            </div>

            <div className="flex-1 my-4 flex flex-col items-center justify-center overflow-hidden">
              {currentPage?.quote ? (
                <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/60 text-center space-y-2">
                  <p className="font-serif italic text-sm text-stone-800 leading-relaxed">
                    {currentPage.quote}
                  </p>
                  <span className="text-[10px] font-mono text-stone-500 block uppercase">
                    — California Memory Notes
                  </span>
                </div>
              ) : pagePhotos[1] ? (
                <div className="w-full h-full rounded-lg overflow-hidden bg-stone-200">
                  <img
                    src={pagePhotos[1].url}
                    alt={pagePhotos[1].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="p-4 text-center text-stone-600 space-y-1">
                  <Heart className="w-5 h-5 text-rose-500 mx-auto" />
                  <p className="font-serif text-xs font-semibold">Memories that last generations</p>
                  <p className="text-[10px] text-stone-400">Captured in high-fidelity 300 DPI</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-500">
              <span>{pagePhotos[1]?.location.name || 'Big Sur, California'}</span>
              <span>Archival Print</span>
            </div>
          </div>
        </div>

        {/* Page Turn Navigation Controls */}
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 text-stone-200 hover:bg-stone-800 disabled:opacity-30 text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Spread</span>
          </button>

          <span className="text-xs text-stone-400 font-mono">
            Spread {currentPageIndex + 1} of {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPageIndex >= totalPages - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-900 text-stone-200 hover:bg-stone-800 disabled:opacity-30 text-xs font-semibold transition-colors"
          >
            <span>Next Spread</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Book Customization Studio Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* 1. Cover Selection */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
            Cover Material & Binding
          </label>
          <div className="space-y-1.5">
            {coverOptions.map((cov) => (
              <div
                key={cov.id}
                onClick={() => setSelectedCoverType(cov.id)}
                className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                  selectedCoverType === cov.id
                    ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div>
                  <span className="font-semibold block">{cov.label}</span>
                  <span className="text-[10px] text-stone-400">{cov.desc}</span>
                </div>
                {selectedCoverType === cov.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Paper Texture Selection */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
            Archival Paper Quality
          </label>
          <div className="space-y-1.5">
            {paperOptions.map((pap) => (
              <div
                key={pap.id}
                onClick={() => setSelectedPaperType(pap.id)}
                className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                  selectedPaperType === pap.id
                    ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                    : 'bg-stone-800/80 border-stone-700/60 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div>
                  <span className="font-semibold block">{pap.label}</span>
                  <span className="text-[10px] text-stone-400">{pap.desc}</span>
                </div>
                {selectedPaperType === pap.id && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Book Dimension & Specs */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
            Physical Dimensions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['8x8', '10x10', '12x12'] as const).map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all ${
                  selectedSize === sz
                    ? 'bg-amber-500 text-stone-950 border-amber-400'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                }`}
              >
                {sz}&rdquo; Square
              </button>
            ))}
          </div>

          <div className="p-3 bg-stone-800/60 rounded-xl space-y-1.5 text-xs text-stone-300">
            <div className="flex justify-between">
              <span className="text-stone-400">Pages included:</span>
              <span className="font-medium">24 archival pages</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Print resolution:</span>
              <span className="font-medium">300 DPI Fine Art</span>
            </div>
            <div className="flex justify-between border-t border-stone-700 pt-1 text-amber-300 font-bold">
              <span>Total Price:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Book Order Checkout Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-6 bg-stone-900 border border-stone-700 rounded-3xl shadow-2xl text-stone-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-base font-bold text-white">
                  {orderComplete ? 'Order Placed Successfully!' : 'Order Physical Photo Book'}
                </h3>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderComplete ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    Your photo book is headed to the press!
                  </h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Order #MV-90821 • Estimated delivery: 3–5 business days
                  </p>
                </div>

                <div className="p-3 bg-stone-800/80 rounded-xl text-left text-xs text-stone-300 space-y-1">
                  <p className="font-semibold text-white">{shippingName}</p>
                  <p className="text-stone-400">{shippingAddress}</p>
                  <p className="text-amber-400 text-[11px] pt-1">
                    Book: {currentBook?.title} ({selectedSize}&rdquo;, {selectedCoverType})
                  </p>
                </div>

                <button
                  onClick={() => setShowOrderModal(false)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-sm"
                >
                  Return to MemoryVault
                </button>
              </div>
            ) : (
              <form onSubmit={handleCompleteOrder} className="space-y-3.5 text-xs">
                {/* Book Summary pill */}
                <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{currentBook?.title}</span>
                    <span className="text-[10px] text-stone-400">
                      {selectedSize}&rdquo; • {selectedCoverType} • {selectedPaperType}
                    </span>
                  </div>
                  <span className="font-bold text-amber-400 text-sm">${totalPrice}</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">Gift Inscription Note (Optional)</label>
                  <textarea
                    rows={2}
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-800/50 text-[11px] text-stone-400">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Free expedited carbon-neutral shipping included</span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-4 py-2 text-stone-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    Submit Order • ${totalPrice}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
