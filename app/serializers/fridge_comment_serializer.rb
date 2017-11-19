class FridgeCommentSerializer < ActiveModel::Serializer
  attributes :comment, :created_at, :updated_at
end
