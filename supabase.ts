export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chapters: {
        Row: {
          id: string
          number: number
          title: string
        }
        Insert: {
          id?: string
          number: number
          title: string
        }
        Update: {
          id?: string
          number?: number
          title?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          chapter_id: string | null
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lines: {
        Row: {
          chapter_id: string
          id: string
          line_order: number
          section_id: string
          text: string
        }
        Insert: {
          chapter_id?: string
          id?: string
          line_order: number
          section_id: string
          text: string
        }
        Update: {
          chapter_id?: string
          id?: string
          line_order?: number
          section_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "lines_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          }
        ]
      }
      sections: {
        Row: {
          chapter_id: string
          id: string
          section_order: number
        }
        Insert: {
          chapter_id: string
          id?: string
          section_order: number
        }
        Update: {
          chapter_id?: string
          id?: string
          section_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "sections_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
