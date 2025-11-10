import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Play, Music, Edit2, Trash2, Check, X } from "lucide-react";
import type { Song } from "@shared/schema";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SongCardProps {
  song: Song;
  onPlay: (song: Song) => void;
}

export function SongCard({ song, onPlay }: SongCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(song.title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const updateTitleMutation = useMutation({
    mutationFn: async (title: string) => {
      return await apiRequest("PATCH", `/api/songs/${song.id}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      setIsEditing(false);
      toast({
        title: "Title Updated",
        description: "Song title has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update song title. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSongMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("DELETE", `/api/songs/${song.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/songs"] });
      toast({
        title: "Song Deleted",
        description: "Your song has been removed from the library.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed",
        description: "Failed to delete song. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateTitleMutation.mutate(editedTitle.trim());
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(song.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteSongMutation.mutate();
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="hover-elevate transition-all group" data-testid={`song-card-${song.id}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Album Art Placeholder */}
            <div className="w-16 h-16 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Music className="h-8 w-8 text-primary" />
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <div className="flex items-center gap-2 mb-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveTitle();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    autoFocus
                    data-testid={`input-edit-title-${song.id}`}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex-shrink-0 h-11 w-11 sm:h-9 sm:w-9"
                    onClick={handleSaveTitle}
                    disabled={updateTitleMutation.isPending}
                    aria-label="Save title"
                    data-testid={`button-save-title-${song.id}`}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="flex-shrink-0 h-11 w-11 sm:h-9 sm:w-9"
                    onClick={handleCancelEdit}
                    disabled={updateTitleMutation.isPending}
                    aria-label="Cancel edit"
                    data-testid={`button-cancel-edit-${song.id}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <h3 className="font-bold mb-1 truncate" data-testid={`text-song-title-${song.id}`}>
                  {song.title}
                </h3>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid={`text-song-lyrics-${song.id}`}>
                {song.lyrics}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" data-testid={`badge-genre-${song.id}`}>
                  {song.genre}
                </Badge>
                {song.playlistType && (
                  <Badge variant="outline" data-testid={`badge-playlist-${song.id}`}>
                    {song.playlistType}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground" data-testid={`text-date-${song.id}`}>
                  {format(new Date(song.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1 flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {!isEditing && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(song);
                    }}
                    aria-label="Play song"
                    data-testid={`button-play-${song.id}`}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    aria-label="Edit song title"
                    data-testid={`button-edit-${song.id}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-11 w-11 sm:h-9 sm:w-9"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    aria-label="Delete song"
                    data-testid={`button-delete-${song.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{song.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid={`button-cancel-delete-${song.id}`}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid={`button-confirm-delete-${song.id}`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
