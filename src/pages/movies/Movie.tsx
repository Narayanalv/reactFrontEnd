import React, { useEffect, useState } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import type {
    ColumnDef,
    SortingState,
    VisibilityState,
    ColumnFiltersState,
} from "@tanstack/react-table";
import API_BASE_URL from "@/config";

type Movie = {
    id: number;
    title: string;
    type: string;
    director: string;
    budget: string;
    location: string;
    duration: number;
    time: string;
    image: string;
};

type ToastType = {
    message: string;
    type: 'success' | 'error';
};

const Movie: React.FC = () => {
    const [data, setData] = useState<Movie[]>([]);
    const [toast, setToast] = useState<ToastType | null>(null);
    const [formData, setFormData] = useState<Movie>({
        id: 0,
        title: "",
        type: "",
        director: "",
        budget: "",
        location: "",
        duration: 0,
        time: "",
        image: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Modal states
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState<number | null>(null);
    const [movieToView, setMovieToView] = useState<Movie | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const openAddModal = () => {
        resetForm();
        setImageFile(null);
        setIsEditMode(false);
        setShowAddEditModal(true);
    };

    const openEditModal = (movie: Movie) => {
        setFormData(movie);
        setImageFile(null);
        setIsEditMode(true);
        setShowAddEditModal(true);
    };

    const openDeleteModal = (id: number) => {
        setMovieToDelete(id);
        setShowDeleteModal(true);
    };

    const openViewModal = (movie: Movie) => {
        setMovieToView(movie);
        setShowViewModal(true);
    };

    const handleAdd = async () => {
        if (
            !formData.title ||
            !formData.type ||
            !formData.director ||
            !formData.budget ||
            !formData.location ||
            !formData.duration ||
            !formData.time ||
            !imageFile
        ) {
            showToast("All fields are required!", "error");
            return;
        }

        // Create FormData for file upload
        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('type', formData.type);
        uploadData.append('director', formData.director);
        uploadData.append('budget', formData.budget);
        uploadData.append('location', formData.location);
        uploadData.append('duration', formData.duration.toString());
        uploadData.append('time', formData.time);
        uploadData.append('image', imageFile);

        try {
            const response = await fetch(`${API_BASE_URL}/addFav`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: uploadData,
            });

            const result = await response.json();

            if (response.ok) {
                // setData([...data, result]);
                setShowAddEditModal(false);
                resetForm();
                setImageFile(null);
                showToast("Movie added successfully!", "success");
            } else {
                showToast(result.message || "Failed to add movie", "error");
            }
        } catch (error) {
            console.error("Error adding movie:", error);
            showToast("Error adding movie", "error");
        }
    };

    const handleSave = async () => {
        if (
            !formData.title ||
            !formData.type ||
            !formData.director ||
            !formData.budget ||
            !formData.location ||
            !formData.duration ||
            !formData.time
        ) {
            showToast("All fields are required!", "error");
            return;
        }

        // Create FormData for file upload
        const uploadData = new FormData();
        uploadData.append('id', formData.id.toString());
        uploadData.append('title', formData.title);
        uploadData.append('type', formData.type);
        uploadData.append('director', formData.director);
        uploadData.append('budget', formData.budget);
        uploadData.append('location', formData.location);
        uploadData.append('duration', formData.duration.toString());
        uploadData.append('time', formData.time);

        // Only append image if a new file is selected
        if (imageFile) {
            uploadData.append('image', imageFile);
        }

        try {
            const response = await fetch(`${API_BASE_URL}/updateFav`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: uploadData,
            });

            const result = await response.json();
            if (response.ok) {
                // setData((prev) =>
                //     prev.map((m) => (m.id === formData.id ? updatedMovie : m))
                // );
                setShowAddEditModal(false);
                resetForm();
                setImageFile(null);
            } else {
                showToast(result.message || "Failed to update movie", "error");
            }
        } catch (error) {
            console.error("Error updating movie:", error);
            showToast("Error updating movie", "error");
        }
    };

    const confirmDelete = async () => {
        if (movieToDelete !== null) {
            try {
                const response = await fetch(`${API_BASE_URL}/deleteFav`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ id: movieToDelete }),
                });

                if (response.ok) {
                    setData((prev) => prev.filter((m) => m.id !== movieToDelete));
                    setShowDeleteModal(false);
                    setMovieToDelete(null);
                } else {
                    alert("Failed to delete movie");
                }
            } catch (error) {
                console.error("Error deleting movie:", error);
                alert("Error deleting movie");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${API_BASE_URL}/getAll`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            const movies = await response.json();
            setData(movies.data);
        };
        fetchData();
    }, []);


    const resetForm = () => {
        setFormData({
            id: 0,
            title: "",
            type: "",
            director: "",
            budget: "",
            location: "",
            duration: 0,
            time: "",
            image: "",
        });
    };

    const columns: ColumnDef<Movie>[] = [
        { accessorKey: "title", header: "Title" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "director", header: "Director" },
        { accessorKey: "budget", header: "Budget" },
        { accessorKey: "location", header: "Location" },
        { accessorKey: "duration", header: "Duration" },
        { accessorKey: "time", header: "Time" },
        {
            accessorKey: "image",
            header: "Image",
            cell: (info) => (
                <img src={info.getValue<string>()} alt="poster" className="w-12 h-12 object-cover rounded" />
            ),
        },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => openViewModal(row.original)}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        View
                    </button>
                    <button
                        onClick={() => openEditModal(row.original)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => openDeleteModal(row.original.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

    const table = useReactTable({
        data: data ?? [],
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="p-4 relative">
            {/* Custom Toast Notification */}
            {toast && (
                <div
                    className={`absolute top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border min-w-[300px] transition-all duration-300 ${toast.type === 'success'
                            ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                            : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
                        }`}
                    style={{
                        animation: 'slideIn 0.3s ease-out'
                    }}
                >
                    <div className="flex-shrink-0">
                        {toast.type === 'success' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">
                    🎬 Movie Table
                </h1>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                    Add Movie
                </button>
            </div>

            {/* Table Display */}
            <div className="rounded-md border">
                <table className="min-w-full">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-3 text-left font-medium bg-muted/50"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="border-b hover:bg-muted/50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-4 text-muted-foreground"
                                >
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showAddEditModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                        <h2 className="text-xl font-bold mb-4">
                            {isEditMode ? "Edit Movie" : "Add New Movie"}
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <input
                                    placeholder="Enter title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="">Select type</option>
                                    <option value="Movie">Movie</option>
                                    <option value="TV Show">TV Show</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Director</label>
                                <input
                                    placeholder="Enter director"
                                    value={formData.director}
                                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Budget</label>
                                <input
                                    type="text"
                                    placeholder="Enter budget"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Location</label>
                                <input
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Duration (mins)</label>
                                <input
                                    type="number"
                                    placeholder="Enter duration"
                                    value={formData.duration || ""}
                                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Time</label>
                                <input
                                    placeholder="Enter time"
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="border bg-background px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            // Create preview URL
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, image: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="border bg-background px-3 py-2 rounded-md w-full file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                                />
                                {formData.image && (
                                    <div className="mt-2">
                                        <img src={formData.image} alt="Preview" className="w-24 h-24 object-cover rounded border" />
                                    </div>
                                )}
                                {isEditMode && !imageFile && (
                                    <p className="text-sm text-muted-foreground mt-1">Leave empty to keep current image</p>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddEditModal(false);
                                    resetForm();
                                }}
                                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={isEditMode ? handleSave : handleAdd}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                            >
                                {isEditMode ? "Save Changes" : "Add Movie"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card border rounded-lg p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6 text-muted-foreground">Are you sure you want to delete this movie? This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setMovieToDelete(null);
                                }}
                                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && movieToView && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Movie Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={movieToView.image}
                                    alt={movieToView.title}
                                    className="w-48 h-64 object-cover rounded border shadow-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Title</p>
                                    <p className="text-lg">{movieToView.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Type</p>
                                    <p className="text-lg">{movieToView.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Director</p>
                                    <p className="text-lg">{movieToView.director}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Budget</p>
                                    <p className="text-lg">{movieToView.budget}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                                    <p className="text-lg">{movieToView.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Duration</p>
                                    <p className="text-lg">{movieToView.duration} minutes</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-muted-foreground">Time</p>
                                    <p className="text-lg">{movieToView.time}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setMovieToView(null);
                                }}
                                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Movie;