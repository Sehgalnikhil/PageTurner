import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import Navbar from '../components/Navbar';
import Footer from '../components/layout/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { bookService } from '../services/api';
import { useSnackbar } from 'notistack';
import {
  PiPencilSimpleBold,
  PiCheckBold,
} from 'react-icons/pi';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [category, setCategory] = useState('Fiction');
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [language, setLanguage] = useState('English');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setFetching(true);
    bookService
      .getById(id)
      .then((response) => {
        const b = response.data;
        setTitle(b.title || '');
        setAuthor(b.author || '');
        setPublishYear(b.publishYear || '');
        setCategory(b.category || 'Fiction');
        setDescription(b.description || '');
        setIsbn(b.isbn || '');
        setPageCount(b.pageCount || '');
        setLanguage(b.language || 'English');
        if (b.image) {
          const fullImg = b.image.startsWith('http') ? b.image : `http://localhost:5555${b.image}`;
          setPreviewUrl(fullImg);
          if (b.image.startsWith('http')) {
            setImageUrl(b.image);
          }
        }
        setFetching(false);
      })
      .catch((error) => {
        setFetching(false);
        enqueueSnackbar('Failed to load book data.', { variant: 'error' });
        console.error(error);
      });
  }, [id]);

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setPreviewUrl(url);
      setImageFile(null);
    }
  };

  const handleEditBook = (e) => {
    e?.preventDefault();

    if (!title.trim() || !author.trim() || !publishYear) {
      enqueueSnackbar('Please provide a title, author, and publication year.', { variant: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('publishYear', publishYear);
    formData.append('category', category);
    formData.append('description', description.trim());
    formData.append('isbn', isbn.trim());
    formData.append('pageCount', pageCount);
    formData.append('language', language);

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (imageUrl) {
      formData.append('image', imageUrl);
    }

    setLoading(true);
    bookService
      .update(id, formData)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Book record updated successfully.', { variant: 'success' });
        navigate(`/books/details/${id}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar(
          error.customMessage || error.response?.data?.message || 'Failed to update book record.',
          { variant: 'error' }
        );
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#302A27]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="mb-6">
          <BackButton destination={`/books/details/${id}`} label="Back to Book Details" />
        </div>

        {fetching ? (
          <div className="py-24 flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <div className="editorial-sheet p-8 sm:p-10 bg-white">
            <div className="mb-8 pb-4 border-b border-[#E8DED1]">
              <span className="text-xs uppercase font-mono font-semibold text-burgundy tracking-wider block mb-1">
                Edit Archival Record
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302A27] leading-tight">
                Update &ldquo;{title}&rdquo;
              </h1>
              <p className="text-xs text-[#81766D] mt-1">
                Revise bibliographic metadata, category taxonomy, or cover artwork.
              </p>
            </div>

            <form onSubmit={handleEditBook} className="space-y-6">
              {/* Title & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    Book Title <span className="text-burgundy">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    Author <span className="text-burgundy">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Year & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    Publication Year <span className="text-burgundy">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={publishYear}
                    onChange={(e) => setPublishYear(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    Genre / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs font-semibold cursor-pointer bg-white"
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Biography">Biography</option>
                    <option value="Technology">Technology</option>
                    <option value="Uncategorized">Uncategorized</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                  Synopsis &amp; Editorial Summary
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="editorial-input w-full p-3 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Cover Image Inputs & Preview */}
              <div className="p-4 rounded-xl bg-[#F7F3EC] border border-[#E8DED1]">
                <label className="block text-xs font-semibold text-[#302A27] mb-2">
                  Cover Artwork
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-3">
                    <input
                      type="url"
                      placeholder="Paste image URL..."
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      className="editorial-input w-full p-2.5 rounded-xl text-xs bg-white"
                    />

                    <div className="flex items-center gap-2 text-xs text-[#81766D]">
                      <span>or replace with image file:</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="text-xs text-[#81766D] file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-stone-200 file:text-stone-800 hover:file:bg-stone-300 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4 flex justify-center">
                    {previewUrl ? (
                      <div className="w-20 h-28 rounded-md overflow-hidden border border-stone-300 shadow-sm">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-28 rounded-md bg-stone-200 flex items-center justify-center text-stone-400 text-xs">
                        No image
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={pageCount}
                    onChange={(e) => setPageCount(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#302A27] mb-1.5">
                    Language
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="editorial-input w-full p-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-[#E8DED1] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/books/details/${id}`)}
                  className="px-4 py-2 rounded-full btn-paper text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full btn-burgundy text-xs shadow-sm disabled:opacity-50"
                >
                  <PiCheckBold className="text-xs" />
                  <span>{loading ? 'Saving Changes...' : 'Save Revisions'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditBook;